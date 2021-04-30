

var N,x,n,d,l,Resistance_per,F,Vrline,Pr,Pfr,Dis,Dab,Dbc,Dca,system,model;
var R,w,Vr,Irmag,theta,Ir,SGMDL,MGMD,Inductance,SGMDC,Capacitance,Xl,Xc,Ic,A,B,C,D,Y,Z,Zc,Vs,Is,VR,Ps,powerLoss,efficiency,model,compens,sign;

 function checkradio() {
   if (document.getElementById("symmetrical").checked) {
     document.getElementById("symmetricalDiv").classList.remove("hide");
     document.getElementById("unsymmetricalDiv").classList.add("hide");
   } else {
     document.getElementById("unsymmetricalDiv").classList.remove("hide");
     document.getElementById("symmetricalDiv").classList.add("hide");
   }
 }

 function initialize() {
   N = parseInt(document.getElementById("numSubCond").value); //Number of sub-conductors per bundle
   x = parseFloat(document.getElementById("distSubCond").value); //Spacing between the sub-conductors
   n = parseInt(document.getElementById("numStrands").value); //Number of strands in each sub conductor
   d = parseFloat(document.getElementById("strandDia").value); //Diameter of each layer
   if (document.getElementById("short").checked) model = "short";
   else if (document.getElementById("medium").checked) model = "medium";
   else model = "long";
   l = parseFloat(document.getElementById("lineLength").value); //Length of the line in km
   Resistance_per = parseFloat(document.getElementById("lineResistance").value); //Resistance of the line per km
   F = parseFloat(document.getElementById("powerFreq").value); //Power Frequency
   Vrline = parseFloat(document.getElementById("systVolt").value) * 1000; //Nominal System Voltage
   Pr = parseFloat(document.getElementById("Pr").value) * 1000000; //Receiving end load in MW
   Pfr = parseFloat(document.getElementById("pf").value); //Power factor of the receiving end load
   if (document.getElementById("symmetrical").checked) {
     system = document.getElementById("symmetrical").value;
     Dis = parseFloat(document.getElementById("D").value);
   }
   if (document.getElementById("unsymmetrical").checked) {
     system = document.getElementById("unsymmetrical").value;
     Dab = parseFloat(document.getElementById("Dab").value);
     Dbc = parseFloat(document.getElementById("Dbc").value);
     Dca = parseFloat(document.getElementById("Dac").value);
   }

   
 }

 function compute() {
   initialize();
//Basic
R = Resistance_per*l;
w = 2*Math.PI*F;
Vr = Vrline/math.sqrt(3);
receivingCurrent();


console.log(Ir,Pfr,Pr,theta,Irmag);

// 1. Inductance per phase per km in H/km
   SGMDL = Math.pow(SGMD(), 1 / N);
   Inductance = 2 * math.pow(10, -4) * Math.log(MGMD() / SGMDL);
   console.log(Inductance, SGMDL, MGMD(),SGMD());

// 2. Capacitance per phase per km in F/km.
   
     SGMDC = Math.pow(SGMD() / 0.7788, 1 / N);
     Capacitance =
       (2 * Math.PI * 8.854187817 * math.pow(10, -9)) /
       Math.log(MGMD() / SGMDC);
     console.log("2");
   console.log(Capacitance, SGMDC);

// 3. Inductive reactance of the line in Ohm.
   Xl = w * Inductance * l;
   console.log(Xl);

// 4. Capacitive reactance of the line in Ohm.
   Xc = 1 / (w * Capacitance * l);
   console.log(Xc);

// 6. Calculate ABCD parameters of the line.
   ABCD();
   console.log(A + "  " + B + "  " + C + "  " + D);

// 7. Calculate the sending end voltage in kV, if the receiving end voltage is maintained at nominal system voltage.
   Vs = math.add(math.multiply(A, Vr), math.multiply(B, Ir));
   console.log(Vs);

// 8. Calculate the sending end current in A.
   Is = math.add(math.multiply(C, Vr), math.multiply(D, Ir));
   console.log(Is);

// 5. Charging current drawn from the sending end substation
   Ic = math.subtract(Is,Ir);
   console.log(Ic);

// 9. Calculate the percentage voltage regulation.
   VR = ((math.abs(Vs) / math.abs(A) - math.abs(Vr)) / math.abs(Vr)) * 100;
   console.log(VR);

// 10. Calculate the power loss in the line in MW.
   Ps =3 * math.abs(Vs) * math.abs(Is) * math.cos(math.atan(Vs.im / Vs.re) - math.atan(Is.im / Is.re));
   powerLoss = Ps - Pr;
   console.log(powerLoss);

   // 11. Calculate the transmission efficiency.
   efficiency = (Pr / Ps) * 100;
   console.log(efficiency);

   // 12. Draw the sending end circle diagram.
   Circle_Diagram()

   // 13. Draw the receiving end circle diagram.

   // 14. Comment on the compensation requirement at the receiving end to maintain the voltage at nominal value. (Only for short line model)

   // 15. Compute the amount of compensation required in MVar. (Only for short line model)
   if(model === "short"){
    compensation();
   }

   //Output
   Output();
 }

 function MGMD() {
   let MGMD;
   if (system === "symmetrical") MGMD = Dis;
   else MGMD = Math.pow(Dab * Dbc * Dca, 1 / 3);
   console.log(Dab,Dbc,Dca);
   return MGMD;
 }

 function SGMD() {
   let y;
   let r = radius();
   console.log(r);
   switch (N) {
     case 1:
       y = 0.7788 * r;
       break;
     case 2:
       y = 0.7788 * r * Math.pow(x, N - 1);
       break;
     case 3:
       y = 0.7788 * r * Math.pow(x, N - 1);
       break;
     case 4:
       y = 0.7788 * r * Math.pow(x, N - 1) * Math.sqrt(2);
       break;
     case 5:
       y = 0.7788 * r * Math.pow(x, N - 1) * Math.sqrt(Math.sin(54));
       break;
     case 6:
       y = 0.7788 * r * Math.pow(x, N - 1) * 6;
       break;
     default:
       break;
   }
   return y;
 }

 function receivingCurrent(){
  if(Pfr<0){
    Pfr=math.abs(Pfr)
    Irmag = Pr/(3*Vr*Pfr);
    theta = math.acos(Pfr);
    Ir = math.complex({r:Irmag,phi:-theta});
    sign = 1;
  }
  else{
    Pfr=math.abs(Pfr)
    Irmag = Pr/(3*Vr*Pfr);
    theta = math.acos(Pfr);
    Ir = math.complex({r:Irmag,phi:theta});
    sign = -1;
  }
 }

 function ABCD() {
   if (model === "short") {
     A = 1;
     B = math.complex(R, Xl);
     C = 0;
     D = A;
   } else if (model === "medium") {
     Z = math.complex(R, Xl);
     Y = math.complex(0, 1 / Xc);

     A = math.add(math.divide(math.multiply(Z, Y), 2), 1);
     B = Z;
     C = math.add(Y, math.divide(math.multiply(Z, math.square(Y)), 4));
     D = A;
   } else if (model === "long") {
     let temp1, temp2;
     Z = math.complex(R, Xl);
     Y = math.complex(0, 1 / Xc);
     Zc = math.sqrt(math.divide(Z, Y));

     A = math.cosh(math.sqrt(math.multiply(Z, Y)));
     B = math.multiply(math.sinh(math.sqrt(math.multiply(Z, Y))), Zc);
     console.log(temp1);
     C = math.divide(math.sinh(math.sqrt(math.multiply(Z, Y))), Zc);
     D = A;
   }
 }
 function Circle_Diagram() {
   let as, ar, bs, br, r;
   
   if(model === "short"){
    as = (math.abs(D)*Math.pow(math.abs(Vs),2)*math.cos(math.atan(B.im/B.re)))/math.abs(B);
    bs = (math.abs(D)*Math.pow(math.abs(Vs),2)*math.sin(math.atan(B.im/B.re)))/math.abs(B);
    ar = (math.abs(D)*Math.pow(math.abs(Vr),2)*math.cos(math.atan(B.im/B.re)))/math.abs(B);
    br = (math.abs(D)*Math.pow(math.abs(Vr),2)*math.sin(math.atan(B.im/B.re)))/math.abs(B);
    }
   else{
   as = (math.abs(D)*Math.pow(math.abs(Vs),2)*math.cos(math.atan(B.im/B.re)-math.atan(D.im/D.re)))/math.abs(B);
   bs = (math.abs(D)*Math.pow(math.abs(Vs),2)*math.sin(math.atan(B.im/B.re)-math.atan(D.im/D.re)))/math.abs(B);
   ar = (math.abs(D)*Math.pow(math.abs(Vr),2)*math.cos(math.atan(B.im/B.re)-math.atan(D.im/D.re)))/math.abs(B);
   br = (math.abs(D)*Math.pow(math.abs(Vr),2)*math.sin(math.atan(B.im/B.re)-math.atan(D.im/D.re)))/math.abs(B);
   }

   r = math.abs(Vs)*Vr/math.abs(B)/Math.pow(10,6);

   var elt = document.getElementById("calculator_sending");
   var calculator = Desmos.GraphingCalculator(elt,{keypad:false, expressionsCollapsed:true});
   calculator.setExpression({ id: "graph1", latex: `(x-${as/Math.pow(10,6)})^2+(y-${bs/Math.pow(10,6)})^2=${r*r}` });

   var elt = document.getElementById("calculator_receiving");
   var calculator = Desmos.GraphingCalculator(elt,{keypad:false, expressionsCollapsed:true});
   calculator.setExpression({ id: "graph1", latex: `(x+${ar/Math.pow(10,6)})^2+(y+${br/Math.pow(10,6)})^2=${r*r}` });
 }

 function compensation(){
    let a,b,ra;
    a = (math.abs(A)*Math.pow(math.abs(Vr),2)*math.cos(math.atan(B.im/B.re)))/math.abs(B);
    b = (math.abs(A)*Math.pow(math.abs(Vr),2)*math.sin(math.atan(B.im/B.re)))/math.abs(B);
    ra = Vr*Vr/math.abs(B)/Math.pow(10,6);
    console.log(a,b,ra);
    let Qr=math.sqrt(Math.pow(ra,2)-Math.pow((Pr/(3*Math.pow(10,6))+a/Math.pow(10,6)),2)) - b/Math.pow(10,6);
    let Q = sign*math.sin(math.acos(Pfr))*Pr/(Pfr*Math.pow(10,6))/3;
    console.log(Q,Qr);
    compens =  (Qr-Q);

}

function radius(){
  let layer,radi;
  layer = Math.ceil((1+math.sqrt(4*n/3 - 1/3))/2);
  radi = (2*layer-1)*d/2;
  console.log(n,d,layer,radi);
  return radi;
}

function Output(){
    let output = document.getElementsByClassName("output");

    document.getElementById("output").classList.remove("hide");

    output[0].innerText=model;
    output[1].innerText=math.round(Inductance,5);
    output[2].innerText=math.round(Capacitance,12);
    output[3].innerText=math.round(Xl,5);
    output[4].innerText=math.round(Xc,5);
    output[5].innerText=math.round(A,5);
    output[6].innerText=math.round(B,5);
    output[7].innerText=math.round(C,5);
    output[8].innerText=math.round(D,5);
    output[9].innerText=math.round(math.divide(Vs,math.pow(10,3)),5);
    output[10].innerText=math.round(Is,5);
    output[11].innerText=math.round(VR,5);
    output[12].innerText=math.round((Ps-Pr)/math.pow(10,6),5);
    output[13].innerText=math.round(efficiency,5);
    output[14].innerText=math.round(Ic,5);

    if(model === "short"){
      output[15].innerText=math.round(compens,5);
      document.getElementById("compens").classList.remove("hide");
    }
    console.log(compens);

    
    document.getElementById("submitbutton").classList.add("hide");
}


