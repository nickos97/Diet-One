exports.get_week_days = () =>{
    const week_map = {Mon: 0, Tue: 1, Wed: 2, Thu: 3, Fri: 4, Sat: 5, Sun: 6}
    var curday = new Date().toString().split(" ")[0]

    var startdate = new Date((new Date()).setHours(0,0,0,0))
    startdate = (new Date(startdate.getTime() + Math.abs(startdate.getTimezoneOffset()*60000)))
    
    var enddate = new Date(new Date().setHours(23,59,59,999))
    enddate = (new Date(enddate.getTime() + Math.abs(enddate.getTimezoneOffset()*60000)))

    week_keys = Object.keys(week_map)
    for (var i=0; i < week_keys.length; i++) {
        if(week_keys[i] == curday){
            startdate.setDate(startdate.getDate()-week_map[week_keys[i]])
            enddate.setDate(enddate.getDate()+6-week_map[week_keys[i]]) 
        }
    }
    return [startdate,enddate]
}