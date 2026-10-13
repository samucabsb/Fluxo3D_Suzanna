# Referências visuais e técnicas

Só consta aqui o que foi realmente lido. Páginas não visitadas estão marcadas.

| Referência | Lida? | O que interessa | Decisão |
|---|---|---|---|
| [R3F — Scaling performance](https://r3f.docs.pmnd.rs/advanced/scaling-performance) | Sim | Renderização sob demanda; reutilizar geometrias/materiais; instancing; "cada mesh é um draw call" | Aplicado: `dpr={[1, 1.75]}` no `Canvas`. **Não** aplicado `frameloop="demand"`: a partícula e o OrbitControls animam continuamente. Geometrias dos dutos são `useMemo`. Instancing não se justifica com ~6 estações. |
| [R3F — exemplos oficiais](https://r3f.docs.pmnd.rs/getting-started/examples) | Não | Sombras suaves, HTML na cena, vidro | Pendente. `ContactShadows` (drei) já está em uso. |
| [Three.js — exemplos](https://threejs.org/examples/) | Não | Curvas, câmera, instancing | Pendente. A rota usa `CurvePath` + `QuadraticBezierCurve3` + `getPointAt` (parametrização por comprimento de arco) da API oficial. |

## Pendências de pesquisa

Os dois itens "Não" ainda precisam ser abertos e avaliados antes de qualquer mudança de direção de arte 3D.
