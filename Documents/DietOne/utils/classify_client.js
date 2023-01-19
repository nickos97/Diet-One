exports.classify_client=(info)=>{
   
   var range = "";

   if(info['age'] >= 14 && info['age']<=18) range = '14-18';
   if(info['age']>=19 && info['age'] <=30) range = '19-30';
   if(info['age']>=31 && info['age'] <=50) range = '31-50'; 
   if(info['age']>=51 && info['age'] <=70) range = '51-70';
   if(info['age']>70) range = '70';
   
    if(info['sex'] == "male") return 'M'+range;
    else {
        if(info['pregnant']) return 'P' + range;
        else if(info['breastfeeding']) return 'BF' + range;
        else return 'F' + range;
    }

} 
