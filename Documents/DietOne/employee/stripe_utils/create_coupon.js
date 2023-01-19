const stripe = require('stripe')(process.env.STRIPE_SK_KEY)

exports.create_coupon = async(req,res,next) => {

    var info = req.body.coupon_info;
    var couponInfo = {}
    if(info.duration == "forever" || info.duration == "once") {
        couponInfo.percent_off=info.percentOff;
        couponInfo.duration = info.duration;
        couponInfo.name = info.name;
    }
    else{
        couponInfo.percent_off=info.percentOff;
        couponInfo.duration = info.duration;
        couponInfo.name = info.name;
        couponInfo.duration_in_months = info.monthsDuration;
    }
    console.log(couponInfo)
    try{
    const coupon = await stripe.coupons.create(couponInfo);
    res.status(200).send({message: "Coupon created"})
    }
    catch(e){
        res.status(400).send({message:"Invalid duration enum(repeating,forever,once)",error:e}); 
        return next();
    }
    
    
}