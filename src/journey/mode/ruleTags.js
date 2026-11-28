/** Etiquetas de lo que hace distinta a una constelación (para la ficha y el Atlas). */
export function ruleTags(level) {
  const s = level.spec, r = s.rules || {}, b = s.board || {}, tags = [];
  if (r.rotate === false) tags.push(['↻̸', 'Sin girar']);
  if (r.hold === false) tags.push(['⊘', 'Sin reserva']);
  if (r.holdLimit != null) tags.push(['⊙', `Reserva ${r.holdLimit} ${r.holdLimit === 1 ? 'vez' : 'veces'}`]);
  if (r.stackAlpha != null) tags.push(['◐', 'Niebla']);
  if (r.accel) tags.push(['»', 'Gravedad que acelera']);
  if (b.rows) tags.push(['▦', `${b.rows} filas de roca`]);
  if (b.astros) tags.push(['★', `${b.astros} astros`]);
  if (b.dust) tags.push(['◌', `${b.dust} de polvo`]);
  if (b.ice) tags.push(['❄', `${b.ice} de hielo`]);
  if (b.holes) tags.push(['●', `${b.holes} ${b.holes === 1 ? 'agujero negro' : 'agujeros negros'}`]);
  if (s.comets) tags.push(['☄', 'Cometas']);
  if (s.shooting) tags.push(['✦', 'Estrellas fugaces']);
  if (s.boss) tags.push(['♛', 'Jefe']);
  return tags;
}
