---
title: "Estado del crédito con ITIN 2026: datos, prestamistas y nuevas reglas"
description: "Nuestro informe 2026 sobre préstamos con ITIN: cifras frescas de HMDA, quién sigue prestando y qué significan las nuevas reglas del Tesoro y el cruce de datos del IRS."
tier: flagship
targetQuery: "estado de los prestamos con ITIN 2026"
relatedQueries:
  - "estadisticas de hipotecas con ITIN 2026"
  - "cuantos prestamos ITIN se hacen cada año"
  - "orden ejecutiva ITIN bancos 2026"
  - "IRS ICE datos ITIN"
  - "tamaño del mercado de prestamos ITIN"
quickAnswer: "Cada año se originan entre 5,000 y 6,000 hipotecas con ITIN frente a unos 5 millones de ITIN activos, según los mejores estimados disponibles. Doce prestamistas de nuestra lista mantenían programas ITIN en julio de 2026. Una orden ejecutiva de mayo de 2026 ordena al Tesoro proponer nuevas reglas de diligencia debida bancaria que señalan el uso del ITIN, con propuesta prevista para mediados de agosto."
publishedAt: "2026-07-18"
author: "Research Desk"
category: "Investigación"
relatedSlugs:
  - "itin-auto-loan-lenders"
  - "itin-mortgage-lenders"
  - "itin-car-loan"
  - "itin-credit-builder-loan"
faqs:
  - q: "¿Cuántas hipotecas con ITIN se hacen cada año?"
    a: "Nadie las cuenta oficialmente. El Urban Institute estimó que en 2023 se originaron entre 5,000 y 6,000 hipotecas con ITIN, frente a un mercado potencial que dimensionó en 73,000 a 88,000 préstamos al año si cayeran las barreras. HMDA, la base de datos hipotecaria federal, no tiene campo de ITIN, así que toda cifra publicada es un estimado."
  - q: "¿El gobierno rastrea los préstamos con ITIN?"
    a: "No. HMDA registra etnicidad, ingresos y resultados del préstamo, pero no si el prestatario usó un ITIN o un número de Seguro Social. Por eso este informe triangula entre los conteos de contribuyentes del IRS, las listas de programas de prestamistas y estimados independientes, en lugar de citar una sola cifra oficial."
  - q: "¿Sigue siendo legal que los bancos presten a personas con ITIN en 2026?"
    a: "Sí. Ninguna ley federal prohíbe prestarle a una persona con ITIN, y ninguna de las acciones de 2026 cambió eso. La orden ejecutiva de mayo de 2026 ordena al Tesoro proponer nuevas reglas de diligencia debida, y una propuesta solo se vuelve obligatoria después del periodo de comentarios públicos y su versión final. Algunos prestamistas podrían endurecer sus criterios por su cuenta antes de eso."
  - q: "¿Qué hace en realidad la orden ejecutiva de mayo de 2026?"
    a: "La Orden Ejecutiva 14406, firmada el 19 de mayo de 2026, ordena al Tesoro examinar la actividad financiera vinculada a personas sin autorización de trabajo. Señala la apertura de cuentas y créditos con ITIN como un área de diligencia debida reforzada y dio al Tesoro 90 días, hasta mediados de agosto de 2026 aproximadamente, para proponer cambios a las reglas de diligencia debida de la Ley de Secreto Bancario. No prohibió los préstamos ni las cuentas bancarias con ITIN."
  - q: "¿De verdad el IRS compartió datos de contribuyentes con ICE?"
    a: "Sí. Bajo un acuerdo de abril de 2025, el IRS entregó a ICE 47,289 direcciones de contribuyentes, según un resumen del Servicio de Investigación del Congreso sobre los litigios. Desde entonces, jueces federales en Washington y Massachusetts han limitado tanto el intercambio como el uso de esos datos, y un fallo determinó que unas 42,695 entregas violaron la ley de privacidad del contribuyente. Las apelaciones seguían pendientes en la primavera de 2026."
  - q: "¿Dónde se hacen la mayoría de las hipotecas con ITIN?"
    a: "En Texas, California y Florida. Esos tres estados encabezaron el país en préstamos hipotecarios a prestatarios hispanos o latinos en 2024, con 122,559, 106,624 y 102,590 préstamos originados en nuestra extracción de HMDA, y es donde la mayoría de los prestamistas ITIN concentran sus programas. Les siguen Arizona e Illinois."
  - q: "¿Este informe se actualizará?"
    a: "Sí. Es una serie trimestral. Cada edición vuelve a correr la misma extracción de datos públicos, revisa la lista de prestamistas y actualiza la sección regulatoria. La próxima edición sale en octubre de 2026 y debería poder incluir lo que el Tesoro proponga en agosto, además de cualquier avance en las apelaciones sobre el cruce de datos del IRS."
published: true
---

**Cómo elaboramos este informe:** Extrajimos los datos hipotecarios de la API pública del navegador de datos HMDA el 18 de julio de 2026, luego verificamos cada afirmación regulatoria contra documentos primarios y cotejamos los estimados de mercado con fuentes publicadas con nombre. HMDA no tiene campo de ITIN, así que nunca presentamos cifras de HMDA como conteos de préstamos ITIN. La metodología completa, incluyendo lo que no podemos saber, está al final. Ningún prestamista pagó por aparecer.

---

Nadie en el gobierno federal cuenta los préstamos con ITIN. Ni HMDA, ni el CFPB, ni el IRS. Así que este mercado funciona cada año a base de estimaciones, y en 2026 estimar se volvió más difícil porque las reglas empezaron a moverse. Este informe reúne lo que sí se puede verificar: los datos hipotecarios públicos de los mercados que atienden los prestamistas ITIN, la lista de prestamistas que mantenemos, las cifras del IRS sobre quién tiene un ITIN, más las acciones federales de este año que podrían cambiarlo todo.

## Hallazgos principales

- El estimado del Urban Institute, todavía el único creíble, sitúa las hipotecas con ITIN en 5,000 a 6,000 préstamos originados en 2023, frente a un mercado potencial de 73,000 a 88,000 préstamos al año.
- El IRS ha emitido unos 31 millones de ITIN desde 1996. Alrededor de 5 millones estaban activos en octubre de 2025, según una auditoría de TIGTA de marzo de 2026.
- Los prestatarios hispanos o latinos recibieron el 11.1% de todas las hipotecas originadas en EE. UU. en 2024, una participación récord, frente al 8.5% de 2019. El mercado total se encogió 34% en ese periodo; el crédito a estos prestatarios cayó apenas 13%.
- Las tasas de rechazo para solicitantes hispanos o latinos llegaron a 31.8% en 2024 en nuestra extracción de HMDA, desde el mínimo de 21.7% en 2021.
- Doce prestamistas y cooperativas de crédito de nuestra lista mantenían programas activos de hipotecas ITIN en julio de 2026. No encontramos salidas este año.
- La Orden Ejecutiva 14406, firmada el 19 de mayo de 2026, da al Tesoro 90 días, hasta mediados de agosto aproximadamente, para proponer cambios de diligencia debida bancaria. Un aviso conjunto de FinCEN del 5 de junio lista 18 señales de alerta y señala la apertura de cuentas con ITIN como posible detonante de diligencia debida reforzada.
- El IRS entregó a ICE 47,289 direcciones de contribuyentes bajo un acuerdo de abril de 2025. Dos medidas cautelares federales limitan ahora el programa mientras corren las apelaciones.

## ¿Cuántas personas tienen un ITIN en 2026?

El IRS emite el Número de Identificación Personal del Contribuyente a personas que deben impuestos en EE. UU. pero no califican para un número de Seguro Social. Una auditoría de marzo de 2026 del Inspector General del Tesoro para la Administración Tributaria ([informe TIGTA 2026-400-016](https://www.tigta.gov/sites/default/files/reports/2026-03/2026400016fr.pdf)) contó unos 31 millones de ITIN emitidos desde que el programa arrancó en 1996, de los cuales alrededor de 5 millones seguían activos en octubre de 2025, con 469,888 ITIN nuevos emitidos en 2025. Los ITIN vencen tras tres años seguidos sin uso, y por eso el conteo activo queda tan por debajo del total emitido.

Los números activos y las declaraciones de impuestos son cosas distintas. El estudio de investigación 2024 del [Defensor del Contribuyente del IRS](https://www.taxpayeradvocate.irs.gov/wp-content/uploads/2024/12/ARC24_RR_Research_3.pdf) encontró unas 3.8 millones de declaraciones presentadas para el año fiscal 2022 con al menos un ITIN, reportando $14.4 mil millones en ingresos gravables. Solo California tuvo 866,378 declarantes con ITIN ese año, más que cualquier otro estado.

El dinero en juego no es menor. El Institute on Taxation and Economic Policy [calculó](https://itep.org/undocumented-immigrants-taxes-2024/) que los inmigrantes indocumentados, que en su mayoría usan ITIN cuando declaran, pagaron $96.7 mil millones en impuestos en EE. UU. en 2022. Eso incluyó $25.7 mil millones al Seguro Social, un programa del que la mayoría de los declarantes con ITIN no puede cobrar.

Una nota de mantenimiento sobre nuestras propias cifras. Nuestra página de inicio ha citado por mucho tiempo 5.8 millones de ITIN, cifra que venía de un informe de TIGTA de diciembre de 2023 que contaba los ITIN activos al cierre de 2022. El conteo fresco de unos 5 millones activos es el mejor número ahora, y es el que usa este informe.

## ¿Cuántas hipotecas con ITIN se originan en realidad?

La respuesta honesta: nadie lo sabe con precisión, y quien cite una cifra exacta está adivinando. El mejor estimado independiente viene del Urban Institute, cuyo [estudio de febrero de 2024](https://www.urban.org/research/publication/itin-mortgages) situó las hipotecas con ITIN en 5,000 a 6,000 préstamos originados en 2023. El mismo estudio dimensionó el mercado potencial en 73,000 a 88,000 préstamos al año si cayeran las barreras estructurales. Esa brecha, de más de diez veces, es el número más importante de este nicho.

¿Por qué tan amplia? El mercado secundario. Fannie Mae y Freddie Mac por lo general no compran préstamos ITIN, y FHA no asegura un préstamo sin prueba de residencia elegible. Así que los prestamistas deben conservar las hipotecas ITIN en sus propios libros o venderlas a inversionistas especializados, lo que limita el volumen y sube las tasas. National Mortgage News, citando al Filene Research Institute, ha [reportado](https://www.nationalmortgagenews.com/list/itin-mortgage-originators-tout-growing-market-in-a-low-volume-era) un mercado direccionable de más de 21 millones de clientes con acceso bancario limitado, y la encuesta de Filene encontró que 76 de las 108 cooperativas de crédito consultadas ofrecían algún préstamo ITIN.

Ninguna fuente publicada estima el volumen anual de hipotecas ITIN en dólares. Aplicar los montos típicos que documentan nuestras guías de prestamistas al estimado de unidades del Urban Institute sugiere algo del orden de $1.5 a $2 mil millones al año. Eso es aritmética nuestra de servilleta y nada más. Frente a un mercado total de originación de $2 billones (trillions en inglés), el crédito ITIN es un error de redondeo con consecuencias humanas enormes.

## ¿Qué muestran los datos hipotecarios en los mercados con más ITIN?

HMDA no marca los préstamos ITIN, así que seguimos lo más cercano: los resultados hipotecarios de los prestatarios hispanos o latinos, el grupo que la investigación demográfica identifica consistentemente como la gran mayoría de los titulares de ITIN. Toma estas cifras como contexto del mercado donde operan los prestamistas ITIN. No son conteos de préstamos ITIN.

Extrajimos estas cifras nosotros mismos de la [API del navegador de datos HMDA de la FFIEC](https://ffiec.cfpb.gov/data-browser/) el 18 de julio de 2026.

| Año | Préstamos originados | Volumen ($ miles de millones) | Participación en EE. UU. | Tasa de rechazo* |
|---|---|---|---|---|
| 2019 | 792,961 | 185.0 | 8.5% | 28.8% |
| 2020 | 1,153,417 | 298.2 | 7.9% | 23.3% |
| 2021 | 1,328,758 | 362.9 | 8.8% | 21.7% |
| 2022 | 794,960 | 220.4 | 9.4% | 30.4% |
| 2023 | 595,141 | 159.3 | 10.4% | 34.3% |
| 2024 | 689,004 | 193.8 | 11.1% | 31.8% |

*Solicitudes rechazadas como proporción de originaciones más rechazos. Excluye expedientes retirados o incompletos. Solo prestatarios hispanos o latinos.

Dos cosas saltan a la vista. Primero, la resiliencia. Las originaciones totales en EE. UU. se desplomaron de 9.3 millones de préstamos en 2019 a 6.2 millones en 2024, una caída de 34%, mientras el crédito a prestatarios hispanos o latinos cayó solo 13%. Su participación en el mercado subió cada año después de 2020 y alcanzó un récord de 11.1% en 2024. El [Informe 2025 del Estado de la Vivienda Hispana de NAHREP](https://nahrep.org/downloads/2025-state-of-hispanic-homeownership-report.pdf) muestra la demanda detrás de eso: los hogares hispanos representaron el 92.6% del crecimiento en formación de hogares de EE. UU. en 2025 y llegaron a 10.2 millones de hogares propietarios, un récord, aun cuando la tasa de propiedad de vivienda hispana bajó a 48.5%.

Segundo, el apretón. Las tasas de rechazo para estos prestatarios saltaron diez puntos desde el mínimo de 2021, hasta 31.8% en 2024. Parte de eso son las tasas y los precios. Parte es la caja de crédito cerrándose justo donde viven los prestatarios ITIN: expedientes delgados, ingresos por cuenta propia, ganancias en efectivo.

El panorama estatal coincide con dónde se concentran los programas ITIN:

| Estado | Préstamos originados (2024) | Volumen ($ miles de millones) | Participación estatal | Tasa de rechazo* |
|---|---|---|---|---|
| Texas | 122,559 | 30.3 | 24.8% | 33.5% |
| California | 106,624 | 39.2 | 20.9% | 30.9% |
| Florida | 102,590 | 33.0 | 21.5% | 33.6% |
| Arizona | 34,033 | 9.2 | 20.3% | 27.9% |
| Illinois | 26,956 | 5.8 | 13.0% | 29.9% |
| Georgia | 16,529 | 4.5 | 7.3% | 28.9% |
| Carolina del Norte | 17,435 | 4.3 | 6.8% | 29.7% |
| Nueva York | 15,376 | 5.5 | 7.4% | 37.2% |

*Misma definición que arriba. Solo prestatarios hispanos o latinos.

En Texas, una de cada cuatro hipotecas ya va a un prestatario hispano. Ese es el mercado donde pescan los prestamistas ITIN, y explica por qué casi todos los programas ITIN con nombre arrancan por Texas, California y Florida.

## ¿Quién sigue haciendo hipotecas con ITIN en 2026?

Nuestra [guía de prestamistas](/es/articles/itin-mortgage-lenders-approved) sigue a doce instituciones con programas de hipotecas ITIN activos y documentados públicamente en julio de 2026: Guild Mortgage, New American Funding, BuildBuyRefi, Angel Oak Loan Solutions, A&D Mortgage, Carrington Mortgage, ACC Mortgage, IDB Global Federal Credit Union, Dream Home Financing, First Financial Bank en Texas, más las cooperativas Resource One y Red River. Revisamos las páginas de programas cada vez que actualizamos esa guía. Nadie de la lista salió este año hasta donde podemos verificar, y Angel Oak dijo a sus inversionistas en enero que amplió su operación non-QM durante 2025.

Las condiciones se han mantenido. Los enganches van de 10% a 20%, los puntajes mínimos rondan 620 o crédito alternativo, y los precios quedan 1% a 3% por encima de lo convencional. Un oficial de préstamos citado por National Mortgage News en junio de 2026 puso la prima actual en 1.5 a 2 puntos porcentuales con 20% de enganche, lo que coincide con las páginas de los programas. Con el promedio de Freddie Mac a 30 años en [6.55% a mediados de julio de 2026](https://www.freddiemac.com/pmms), el precio típico de una hipoteca ITIN queda alrededor de 8% a 9%. Nuestra [guía de tasas](/es/articles/itin-mortgage-rates) le da seguimiento con más detalle.

El viento a favor es el auge non-QM. BofA Securities proyecta que la producción non-QM llegará a $175 mil millones en 2026, desde $108 mil millones en 2025, según [HousingWire](https://www.housingwire.com/articles/non-qm-originations-175b-2026/). Polygon Research, trabajando con aproximaciones de HMDA, dimensiona el mercado non-QM de 2025 mucho más grande, en $239 mil millones y 10.2% de todas las originaciones. Las definiciones difieren y nadie las reconcilia, pero de cualquier forma el canal que carga los préstamos ITIN está creciendo. Ninguna fuente que encontremos estima qué parte le toca al crédito ITIN.

Un cambio de política alimentó la tubería. En marzo de 2025, FHA [eliminó la elegibilidad de los residentes no permanentes](https://www.consumerfinancemonitor.com/2025/03/31/hud-reverses-course-and-eliminates-eligibility-of-non-permanent-u-s-residents-for-fha-loans/), con efecto desde mayo. Los prestatarios que antes tenían un camino FHA, incluidos los beneficiarios de DACA, ahora caen en el mismo canal non-QM que los prestatarios ITIN, con los mismos enganches y tasas más altos.

## ¿Qué significan las nuevas reglas federales para los prestatarios con ITIN?

Reescribimos esta sección más veces que ninguna otra, porque aquí es donde el miedo suele correr más rápido que los hechos. Esto es lo que en realidad pasó en 2026, en orden, según documentos primarios.

**19 de mayo: la orden ejecutiva.** El presidente firmó la [Orden Ejecutiva 14406, "Restoring Integrity to America's Financial System"](https://www.federalregister.gov/documents/2026/05/22/2026-10400/restoring-integrity-to-americas-financial-system), publicada en el Registro Federal el 22 de mayo. Ordena a los reguladores financieros examinar seis categorías de actividad vinculadas a personas sin autorización de trabajo. La sexta categoría es el uso de un ITIN para obtener productos de crédito o abrir cuentas de depósito cuando el solicitante carece de estatus migratorio legal verificado. La orden fija tres plazos para el Tesoro: un aviso de señales de alerta en 60 días, cambios propuestos a las reglas de diligencia debida de la Ley de Secreto Bancario en 90 días, que caen alrededor de mediados de agosto de 2026, más una revisión de los requisitos de identificación de clientes, incluidas las matrículas consulares, en 180 días.

**5 de junio: el aviso de FinCEN.** FinCEN, junto con la FDIC, la OCC y la NCUA, emitió el [aviso FIN-2026-A002](https://www.fincen.gov/system/files/2026-06/FinCEN-Advisory-Non-Work-Authorized-Populations.pdf). Lista 18 señales de alerta en tres grupos: clientes individuales, empresas grandes y empresas pequeñas en agricultura, construcción, servicio doméstico, hospitalidad y agencias de personal. Varias señales involucran cuentas abiertas con ITIN combinadas con patrones como retiros de efectivo estructurados o remesas al extranjero muy frecuentes. El aviso trae una sección titulada "Enhanced Due Diligence for ITINs", que dice que presentar un ITIN en lugar de un SSN puede identificarse como un factor de riesgo que requiere diligencia debida reforzada, y pide a los bancos etiquetar los reportes de actividad sospechosa relacionados con la clave FINANCIALINTEGRITY-2026-A002. El mismo aviso aclara que sus señales de alerta no crean ni modifican ninguna obligación regulatoria independiente.

**Junio y julio: la guía posterior.** El CFPB emitió el 8 de junio una declaración sobre cómo el estatus migratorio interactúa con las obligaciones de capacidad de pago. Luego, el 13 de julio, la OCC, la FDIC y la NCUA [emitieron una guía conjunta](https://ncua.gov/newsroom/press-release/2026/agencies-issue-guidance-lending-individuals-not-legally-authorized-work-united-states) que dice que los préstamos a personas sin autorización legal de trabajo pueden presentar un riesgo crediticio elevado y que las instituciones deben manejar esos riesgos con prácticas de originación sanas. Vale notar algo: esa guía de préstamos nunca menciona los ITIN por nombre.

Ahora la otra mitad del libro contable, que importa igual. Nada de lo anterior es una ley, y nada de lo anterior prohíbe los préstamos ni las cuentas bancarias con ITIN. Lo de mediados de agosto es una propuesta, que después pasa por comentarios públicos antes de que cualquier regla sea final. El lenguaje de la orden sobre el ITIN también es más estrecho de lo que sugiere la mayoría de la cobertura: apunta al uso del ITIN por solicitantes que carecen de estatus migratorio legal verificado, y un ITIN por sí solo no dice nada del estatus en ninguna dirección. El propio aviso de FinCEN lo deja claro: los ITIN no constituyen evidencia de estatus legal en Estados Unidos.

La reacción de la banca ha sido cautelosa, no hostil. La Independent Community Bankers of America [respondió](https://www.independentbanker.org/w/icba-statement-on-executive-order-on-the-integrity-of-the-u.s.-financial-system) que la orden reconoce los rigurosos requisitos de conocimiento del cliente que los bancos comunitarios ya cumplen, y advirtió contra cargas nuevas que empujen a la gente fuera de la banca regulada. El riesgo práctico para los prestatarios es más silencioso que una prohibición: prestamistas cumpliendo de más antes de que ninguna regla lo exija. La nota de American Banker del 18 de junio se tituló ["CFPB, Fincen guidance casts a pall over ITIN lending"](https://www.nationalmortgagenews.com/news/cfpb-fincen-guidance-casts-a-pall-over-itin-lending), y un prestamista ITIN citado ahí dijo que no había visto a nadie retirarse todavía, pero que creía que era cuestión de tiempo. Al cierre de este informe, ningún banco, cooperativa o prestamista hipotecario ha anunciado públicamente el fin de un programa ITIN. Nuestra lista sigue igual. Actualizaremos esta página si eso cambia.

## ¿Qué está pasando con el cruce de datos del IRS?

La otra historia de 2026 corre por el sistema tributario, y le importa al crédito porque las hipotecas ITIN se construyen sobre declaraciones de impuestos.

En abril de 2025, el IRS y el Departamento de Seguridad Nacional firmaron un memorando de entendimiento que permite a ICE solicitar direcciones de contribuyentes para fines migratorios. Según el [resumen de litigios del Servicio de Investigación del Congreso de marzo de 2026](https://www.everycrsreport.com/reports/LSB11413.html), ICE pidió direcciones de 1.28 millones de personas. El IRS llegó a entregar 47,289 últimas direcciones conocidas antes de que intervinieran los tribunales.

Tres casos federales definen ahora lo que sigue. En noviembre de 2025, la jueza Colleen Kollar-Kotelly en Washington ordenó al IRS compartir datos solo en estricto cumplimiento del estatuto de privacidad tributaria. En febrero de 2026, la jueza Indira Talwani en Massachusetts prohibió a ICE y DHS usar los datos que ya habían recibido. Entre esas dos, el 24 de febrero, la corte de apelaciones del circuito de D.C. falló a favor del gobierno en una pregunta distinta, al sostener que el acuerdo en sí no era revisable y que la entrega de direcciones puede ser legal bajo la excepción de investigación criminal del estatuto. La cobertura de los fallos de febrero, incluyendo el [explicador de KQED para declarantes con ITIN](https://www.kqed.org/news/12073445/tax-day-filing-2026-ice-irs-trump-itin-number-no-social-security-number), reportó que un tribunal encontró que unas 42,695 de las entregas violaron la ley de privacidad del contribuyente. El senador Ron Wyden [lo cifró](https://www.finance.senate.gov/ranking-members-news/wyden-statement-on-judges-ruling-that-irs-ice-data-sharing-violated-taxpayer-privacy-laws) en casi 43,000 casos en una declaración del 26 de febrero. Hay apelaciones pendientes sobre ambas medidas cautelares, así que el estado práctico a mediados de 2026 es este: el intercambio está restringido por orden judicial y el derecho sigue sin resolverse.

La conexión con el crédito es el efecto de enfriamiento sobre las declaraciones. El Yale Budget Lab [estimó](https://budgetlab.yale.edu/research/potential-impact-irs-ice-data-sharing-tax-compliance) que el acuerdo de datos podría costar unos $25 mil millones en ingresos federales solo en 2026 a medida que menos gente declara. El Washington Post reportó en abril que algunos preparadores vieron desaparecer a cientos de clientes de años esta temporada; KQED encontró una clínica del Área de la Bahía donde las declaraciones se sostuvieron. Las dos cosas pueden ser ciertas en lugares distintos. Para este mercado la mecánica es directa: dos años de declaraciones con ITIN son el documento central de casi toda hipoteca ITIN. La gente que deja de declarar por miedo pierde el rastro de papel que la califica, años antes de que cualquier regla de crédito cambie algo.

## ¿Qué hay que vigilar el resto de 2026?

Cuatro fechas y conjuntos de datos importan de aquí a nuestra próxima edición.

**Mediados de agosto.** Se cierra la ventana de 90 días del Tesoro bajo la orden ejecutiva. Lo que proponga pasa a comentarios públicos, y el expediente de comentarios mostrará dónde están parados en realidad los bancos y las cooperativas.

**Las apelaciones.** Las dos medidas cautelares sobre el cruce de datos están apeladas en el circuito de D.C. Un fallo en cualquier dirección cambia qué información puede moverse entre el IRS y las agencias migratorias, y con ello, qué tan seguros se sienten los declarantes con ITIN construyendo el historial tributario del que depende el crédito.

**Los datos HMDA de 2025.** La FFIEC publica el archivo nacional de cada año el verano siguiente. El archivo de 2025 mostrará si la subida en las tasas de rechazo continuó durante el primer año completo del nuevo clima de supervisión.

**Las tasas.** La encuesta semanal de Freddie Mac marcaba 6.55% a mediados de julio, unos 20 puntos base por debajo del año anterior, después de bajar de 6% en febrero por primera vez en tres años y medio. La MBA pronostica $2.2 billones (trillions) en originaciones para 2026, un alza de 8%. Si el mercado general se relaja, los precios ITIN suelen seguirlo con rezago.

Si estás leyendo esto como prestatario y no como investigador, el panorama práctico no ha cambiado: los préstamos son legales y una docena de prestamistas con nombre quiere el negocio. La preparación sigue ganándole al timing. Nuestras guías sobre [cómo calificar para una hipoteca con ITIN](/es/articles/itin-mortgage-qualify) y [cómo construir crédito con un ITIN](/es/articles/how-to-build-credit-with-itin) cubren la mecánica.

## Cómo hicimos este informe, y lo que no podemos saber

Queremos que esta sección sobreviva a cualquier cifra de arriba, porque el mayor problema de los datos sobre crédito ITIN es el exceso de confianza.

**Lo que extrajimos directamente.** Todas las cifras de HMDA vienen de la [API pública del navegador de datos de la FFIEC](https://ffiec.cfpb.gov/data-browser/), extraídas el 18 de julio de 2026, filtradas a préstamos originados y rechazos de prestatarios hispanos o latinos, a nivel nacional y en ocho estados. La salida cruda se puede descargar en [/data/state-of-itin-lending-2026.json](/data/state-of-itin-lending-2026.json), y la misma extracción programada se repite cada trimestre.

**La limitación central.** HMDA no tiene campo de ITIN. Ningún conjunto de datos federal registra si un prestatario hipotecario usó un ITIN o un SSN. Nuestras cifras de HMDA filtradas por etnicidad describen el mercado amplio donde operan los prestamistas ITIN, y las etiquetamos así cada vez que aparecen. Quien presente datos de HMDA como conteos de préstamos ITIN los está usando mal.

**Cómo triangulamos.** Superponemos cuatro fuentes independientes: los conteos del IRS y de TIGTA de titulares y declarantes con ITIN, que acotan la población; el estimado de originaciones del Urban Institute, el único conteo de unidades publicado; nuestra propia lista de prestamistas con programas ITIN públicos, verificada contra las páginas de los propios prestamistas; y reportajes fechados de medios con nombre. Cuando derivamos algo nosotros, como el rango de volumen en dólares, lo decimos y mostramos la aritmética.

**Qué nos probaría equivocados.** Si un prestamista de nuestra lista terminó su programa sin actualizar sus páginas públicas, nuestro conteo de prestamistas está desactualizado. Si los prestatarios ITIN son una porción menor de la demanda hipotecaria hispana de lo que sugieren los estudios demográficos, nuestras tablas de contexto exageran el traslape. Y las secciones regulatorias describen propuestas y litigios en movimiento; cualquiera puede cambiar con un fallo o una regla final. Corregiremos esta página conforme cambien los hechos, con la fecha de actualización visible arriba.

Este informe es informativo. No es asesoría legal ni migratoria, y no es una recomendación de tomar o evitar ningún préstamo. Nada aquí asume el estatus migratorio de nadie. Los ITIN los tienen muchos grupos, incluidos inversionistas extranjeros, estudiantes y cónyuges de ciudadanos, y un ITIN por sí solo no dice nada del estatus.
