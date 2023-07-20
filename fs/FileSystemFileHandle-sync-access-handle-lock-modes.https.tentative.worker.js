importScripts('/resources/testharness.js');
importScripts('resources/sandboxed-fs-test-helpers.js');
importScripts('resources/test-helpers.js');

'use strict';

async function testLockAccess(t, fileHandle, mode) {
  const syncHandle1 = await fileHandle.createSyncAccessHandle({mode});
  t.add_cleanup(() => syncHandle1.close());

  let access;
  try {
    const syncHandle2 = await fileHandle.createSyncAccessHandle({mode});
    syncHandle2.close();
    access = 'shared';
  } catch (e) {
    access = 'exclusive';
    assert_throws_dom('NoModificationAllowedError', () => {
      throw e;
    });
  }
  syncHandle1.close();

  // Can open another sync access handle after other handles have closed
  const syncHandle3 = await fileHandle.createSyncAccessHandle({mode});
  syncHandle3.close();

  return access;
}

async function testLockPermission(t, fileHandle, mode) {
  const syncHandle = await fileHandle.createSyncAccessHandle({mode});
  t.add_cleanup(() => syncHandle.close());

  let permission;
  const writeBuffer = new TextEncoder().encode('Hello Storage Foundation');
  try {
    syncHandle.write(writeBuffer, {at: 0});
    permission = 'readwrite';
  } catch (e) {
    permission = 'readonly';
    assert_throws_dom('NoModificationAllowedError', () => {
      throw e;
    });
  }
  syncHandle.close();

  return permission;
}

directory_test(async (t, root_dir) => {
  const fileHandle = await root_dir.getFileHandle('OPFS.test', {create: true});

  const syncHandle = await fileHandle.createSyncAccessHandle();
  t.add_cleanup(() => syncHandle.close());
  assert_equals(syncHandle.mode, 'readwrite');
  syncHandle.close();

  assert_equals(await testLockAccess(t, fileHandle), 'exclusive');
  assert_equals(await testLockPermission(t, fileHandle), 'readwrite');
}, 'A sync access handle opens in readwrite mode by default');

directory_test(async (t, root_dir) => {
  const fileHandle = await root_dir.getFileHandle('OPFS.test', {create: true});

  assert_equals(await testLockAccess(t, fileHandle, 'readwrite'), 'exclusive');
  assert_equals(
      await testLockPermission(t, fileHandle, 'readwrite'), 'readwrite');
}, 'readwrite mode takes an exclusive lock and is writable');

directory_test(async (t, root_dir) => {
  const fileHandle = await root_dir.getFileHandle('OPFS.test', {create: true});

  assert_equals(await testLockAccess(t, fileHandle, 'read-only'), 'shared');
  assert_equals(
      await testLockPermission(t, fileHandle, 'read-only'), 'readonly');
}, 'read-only mode takes a shared lock and is not writable');

directory_test(async (t, root_dir) => {
  const fileHandle = await root_dir.getFileHandle('OPFS.test', {create: true});

  assert_equals(
      await testLockAccess(t, fileHandle, 'readwrite-unsafe'), 'shared');
  assert_equals(
      await testLockPermission(t, fileHandle, 'readwrite-unsafe'), 'readwrite');
}, 'readwrite-unsafe mode takes a shared lock and is writable');

directory_test(async (t, root_dir) => {
  const fileHandle = await root_dir.getFileHandle('OPFS.test', {create: true});

  const modes = ['readwrite', 'read-only', 'readwrite-unsafe'];
  for (const mode1 of modes) {
    const syncHandle = await fileHandle.createSyncAccessHandle({mode: mode1});
    t.add_cleanup(() => syncHandle.close());
    for (const mode2 of modes) {
      if (mode1 !== mode2) {
        await promise_rejects_dom(
            t, 'NoModificationAllowedError',
            fileHandle.createSyncAccessHandle({mode: mode2}));
      }
    }
    syncHandle.close();
  }
}, 'There can only be open access handles of one mode at any given time');

directory_test(async (t, root_dir) =>  {
  const fooFileHandle = await root_dir.getFileHandle('foo.test', {create: true});
  const barFileHandle = await root_dir.getFileHandle('bar.test', {create: true});

  const fooSyncHandle = await fooFileHandle.createSyncAccessHandle();
  t.add_cleanup(() => fooSyncHandle.close());

  const barSyncHandle1 = await barFileHandle.createSyncAccessHandle();
  t.add_cleanup(() => barSyncHandle1.close());
  await promise_rejects_dom(
      t, 'NoModificationAllowedError', barFileHandle.createSyncAccessHandle());

  barSyncHandle1.close();
  const barSyncHandle2 = await barFileHandle.createSyncAccessHandle();
  barSyncHandle2.close();
}, 'An access handle from one file does not interfere with the creation of an' +
     ' access handle on another file');

directory_test(async (t, root_dir) =>  {
  const fooFileHandle = await root_dir.getFileHandle('foo.test', {create: true});
  const barFileHandle = await root_dir.getFileHandle('bar.test', {create: true});

  const fooWritable = await fooFileHandle.createWritable();
  t.add_cleanup(() => fooWritable.close());

  const barSyncHandle = await barFileHandle.createSyncAccessHandle();
  t.add_cleanup(() => barSyncHandle.close());
}, 'A writable stream from one file does not interfere with the creation of an' +
     ' access handle on another file');

directory_test(async (t, root_dir) =>  {
  const fooFileHandle = await root_dir.getFileHandle('foo.test', {create: true});
  const barFileHandle = await root_dir.getFileHandle('bar.test', {create: true});

  const fooSyncHandle = await fooFileHandle.createSyncAccessHandle();
  t.add_cleanup(() => fooSyncHandle.close());

  const barWritable = await barFileHandle.createWritable();
  t.add_cleanup(() => barWritable.close());
}, 'An access handle from one file does not interfere with the creation of a' +
     ' writable stream on another file');

directory_test(async (t, root_dir) =>  {
  const fileHandle = await root_dir.getFileHandle('OPFS.test', {create: true});

  const syncHandle = await fileHandle.createSyncAccessHandle();
  t.add_cleanup(() => { syncHandle.close(); });
  await promise_rejects_dom(
    t, 'NoModificationAllowedError', cleanup_writable(t, fileHandle.createWritable()));

  syncHandle.close();
  const writable = await fileHandle.createWritable();
  await writable.close();
}, 'Writable streams cannot be created if there is an open access handle');

directory_test(async (t, root_dir) =>  {
  const fileHandle = await root_dir.getFileHandle('OPFS.test', {create: true});

  const writable1 = await fileHandle.createWritable();
  const writable2 = await fileHandle.createWritable();
  await promise_rejects_dom(
      t, 'NoModificationAllowedError', fileHandle.createSyncAccessHandle());

  await writable1.close();
  await promise_rejects_dom(
      t, 'NoModificationAllowedError', fileHandle.createSyncAccessHandle());

  await writable2.close();
  const syncHandle = await fileHandle.createSyncAccessHandle();
  syncHandle.close();
}, 'Access handles cannot be created if there are open Writable streams');

done();
