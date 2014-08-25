Virtual-Physics
===============

Desenvolvimento de simulador de física

(1)       m1.vx,1 = m1.vx,1' + m2.Δvx,2'<br>
(2)       m1.vy,1 = m1.vy,1' + m2.Δvx,2'.tan(θ)
(3)       m1/2.(vx,12+vy,12) = m1/2.(vx,1'2+vy,1'2) + m2/2.Δvx,2'2.(1+tan2(θ))  
(4)       vx,1' = vx,1 - m2/m1.Δvx,2'
(5)       vy,1' = vy,1 - m2/m1.Δvx,2'.tan(θ)  
(6)       Δvx,2' = 2[ vx,1 + tan(θ).vy,1 ] / [(1+tan2(θ)).(1+m2 /m1 )]   .
(7)       γv = arctan [ (vy,1-vy,2)/(vx,1-vx,2) ]
(8)       Δvx,2' = 2[ vx,1 - vx,2 + a.(vy,1 - vy,2 ) ] / [(1+a2).(1+m2 /m1 )]   
(9)       a = tan(θ) = tan(γv+α)  
(10)       vx,2' = vx,2 + Δvx,2'   
(11)       vy,2' = vy,2 + a .Δvx,2'   
(12)       vx,1' = vx,1 - m2/m1.Δvx,2'   
(13)       vy,1' = vy,1 - a. m2/m1.Δvx,2'   
(14)       α = arcsin [ d.sin(γx,y-γv) / (r1+r2) ] 
(15)       d = √ [ (x2-x1)2 +(y2-y1)2 ]  
(16)       γx,y= arctan [ (y2-y1)/((x2-x1) ] 
(17)   t = { d.cos(γx,y-γv) ± √ [(r1+r2)2- (d.sin(γx,y-γv)) 2] } / √ [ (vx,1-vx,2)2 +(vy,1-vy,2)2 ] 
(18)       x1' = x1 + vx,1.t 
(19)       y1' = y1 + vy,1.t 
(20)       x2' = x2 + vx,2.t 
(21)       y2' = y2 + vy,2.t 
(22)       vx,cm = ( m1.vx,1 + m2.vx,2 )/( m1+ m2)   
(23)       vy,cm = ( m1.vy,1 + m2.vy,2 )/( m1+ m2)   
(24)       vx,1'' = (vx,1'-vx,cm).R + vx,cm  
(25)       vy,1'' = (vy,1'-vy,cm).R + vy,cm  
(26)       vx,2'' = (vx,2'-vx,cm).R + vx,cm  
(27)       vy,2'' = (vy,2'-vy,cm).R + vy,cm  

