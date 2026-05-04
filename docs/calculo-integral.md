# Aplicacion Del Calculo Integral

La productividad academica se representa como una funcion discreta dependiente del tiempo:

```text
p(t)
```

Cada registro diario aporta un punto de productividad. Para estimar el rendimiento acumulado, el backend aproxima el area bajo la curva mediante integracion numerica con la regla trapezoidal:

```text
R = integral desde a hasta b de p(t) dt
```

## Promedio integral

El promedio integral se calcula dividiendo el rendimiento acumulado entre la duracion del intervalo:

```text
f_prom = (1 / (b - a)) * integral desde a hasta b de f(x) dx
```

En el sistema, esto permite interpretar el rendimiento promedio continuo del estudiante durante el periodo analizado.
