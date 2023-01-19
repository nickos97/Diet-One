exports.calculate_micro_goals = (calories,fat)=>{
    return [0.1*(calories/9),0.5*fat,0.25*fat];
}