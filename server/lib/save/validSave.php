<?php
/** Comprobación básica de que es una copia de BestTris (la completa la hace el juego al recibirla). */
function bt_valid_save($save): bool {
  return is_object($save) && ($save->format ?? '') === 'prisma-save'
    && is_int($save->version ?? null) && is_object($save->data ?? null);
}
