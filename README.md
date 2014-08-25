Virtual-Physics
===============

Desenvolvimento de simulador de física<br>
OBS:É preciso verificar cada uma dessas fórmulas na implementação para ter certeza se estão retornando o resultado correto, pois ainda assim a simulação está com erros.Eu acredito que pode estar ocorrendo problemas nas funções Math.sin(), Math.cos(), Math.acos(), etc, pois os valores que essas funções aceitam devem ser em radianos.

(1)       m1.vx,1 = m1.vx,1' + m2.Δvx,2'<br>
(2)       m1.vy,1 = m1.vy,1' + m2.Δvx,2'.tan(θ)<br>
(3)       m1/2.(vx,12+vy,12) = m1/2.(vx,1'2+vy,1'2) + m2/2.Δvx,2'2.(1+tan2(θ))  <br>
(4)       vx,1' = vx,1 - m2/m1.Δvx,2'<br>
(5)       vy,1' = vy,1 - m2/m1.Δvx,2'.tan(θ)  <br>
(6)       Δvx,2' = 2[ vx,1 + tan(θ).vy,1 ] / [(1+tan2(θ)).(1+m2 /m1 )]<br>
(7)       γv = arctan [ (vy,1-vy,2)/(vx,1-vx,2) ]<br>
(8)       Δvx,2' = 2[ vx,1 - vx,2 + a.(vy,1 - vy,2 ) ] / [(1+a2).(1+m2 /m1 )]   <br>
(9)       a = tan(θ) = tan(γv+α)  <br>
(10)       vx,2' = vx,2 + Δvx,2'   <br>
(11)       vy,2' = vy,2 + a .Δvx,2'   <br>
(12)       vx,1' = vx,1 - m2/m1.Δvx,2'   <br>
(13)       vy,1' = vy,1 - a. m2/m1.Δvx,2'   <br>
(14)       α = arcsin [ d.sin(γx,y-γv) / (r1+r2) ] <br>
(15)       d = √ [ (x2-x1)2 +(y2-y1)2 ]  <br>
(16)       γx,y= arctan [ (y2-y1)/((x2-x1) ] <br>
(17)   t = { d.cos(γx,y-γv) ± √ [(r1+r2)2- (d.sin(γx,y-γv)) 2] } / √ [ (vx,1-vx,2)2 +(vy,1-vy,2)2 ] <br>
(18)       x1' = x1 + vx,1.t <br>
(19)       y1' = y1 + vy,1.t <br>
(20)       x2' = x2 + vx,2.t <br>
(21)       y2' = y2 + vy,2.t <br>
(22)       vx,cm = ( m1.vx,1 + m2.vx,2 )/( m1+ m2)   <br>
(23)       vy,cm = ( m1.vy,1 + m2.vy,2 )/( m1+ m2)   <br>
(24)       vx,1'' = (vx,1'-vx,cm).R + vx,cm  <br>
(25)       vy,1'' = (vy,1'-vy,cm).R + vy,cm  <br>
(26)       vx,2'' = (vx,2'-vx,cm).R + vx,cm  <br>
(27)       vy,2'' = (vy,2'-vy,cm).R + vy,cm  <br>

