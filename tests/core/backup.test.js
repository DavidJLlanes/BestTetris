import { test } from 'node:test';
import assert from 'node:assert/strict';
import { validateSave } from '../../src/storage/backup/validateSave.js';
import { migrate } from '../../src/storage/backup/migrate.js';
import { FORMAT, VERSION } from '../../src/storage/backup/format.js';

const good = { format: FORMAT, version: VERSION, data: { identity: { name: 'Ana', photo: 'data:image/webp;base64,AAAA' }, records: {} } };

test('una copia válida pasa la validación', () => assert.equal(validateSave(good), null));
test('rechaza archivos ajenos', () => assert.ok(validateSave({ foo: 1 })));
test('rechaza versiones del futuro', () => assert.ok(validateSave({ ...good, version: VERSION + 1 })));
test('rechaza claves desconocidas', () => assert.ok(validateSave({ ...good, data: { hack: 1 } })));
test('rechaza fotos que no son imágenes', () => assert.ok(validateSave({ ...good, data: { identity: { photo: 'javascript:alert(1)' } } })));
test('migrar la versión actual no cambia nada', () => assert.deepEqual(migrate(good.data, VERSION), good.data));
