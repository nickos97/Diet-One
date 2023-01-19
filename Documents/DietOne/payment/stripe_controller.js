const stripe = require('stripe')(process.env.STRIPE_SK_KEY)
const express = require('express');
const router = express.Router();
const { client_register } = require('../identity_server/register');
const { stripe_login } = require('./stripe_login');
const { update_customerId } = require('./update_customerId');
const { update_customerPlan } = require('./update_customerPlan')


router.post('/create-checkout-session', async(req, res, next) => {

    const cust = await stripe.customers.search({
        query: "email:\'client@gmail.com\'",
    })
    var client = req.body;

    if (client.couponName) {

        try {
            const coupons = await stripe.coupons.list({
                limit: 100,
            });
            var couponId;
            for (var i = 0; i < coupons.data.length; i++) {
                if (coupons.data[i].name == client.couponName) {
                    couponId = coupons.data[i].id;
                }
            }
            if (!couponId) {
                res.status(400).send({ message: "Invalid coupon" });
                return next();
            }
        } catch (e) {
            res.status(400).send({ message: "Invalid coupon" });
            return next()
        }


    }

    var client_info = await stripe_login(req, res, next, client);

    cust_id = client_info.customer_id

    if (!cust_id.length || client_info.account_type == "free") {

        const session = await stripe.checkout.sessions.create({

            billing_address_collection: 'auto',
            mode: 'subscription',
            discounts: [{
                coupon: couponId
            }],
            payment_method_types: ['card'],
            line_items: [{
                price: req.body.product_id,
                quantity: 1
            }],
            customer_email: client.email,
            subscription_data: {
                trial_period_days: 1
            },

            success_url: `http://register.diet1.gr/success`,
            cancel_url: `http://register.diet1.gr/cancel`,
            metadata: client
        })

        res.send(session.url)
    } else {
        const returnUrl = 'http://register.diet1.gr/login';

        const portalSession = await stripe.billingPortal.sessions.create({
            customer: cust_id,
            return_url: returnUrl,
        });

        res.send(portalSession.url);
    }
})





router.post(
    '/webhook',
    express.raw({ type: 'application/json' }),
    async(request, response, next) => {
        let event = request.body;
        // Replace this endpoint secret with your endpoint's unique secret
        // If you are testing with the CLI, find the secret by running 'stripe listen'
        // If you are using an endpoint defined with the API or dashboard, look in your webhook settings
        // at https://dashboard.stripe.com/webhooks
        const endpointSecret = process.env.WEBHOOK_SK_KEY;
        // Only verify the event if you have an endpoint secret defined.
        // Otherwise use the basic event deserialized with JSON.parse
        if (endpointSecret) {
            // Get the signature sent by Stripe
            const signature = request.headers['stripe-signature'];
            try {
                event = stripe.webhooks.constructEvent(
                    request.rawBody,
                    signature,
                    endpointSecret
                );
            } catch (err) {
                console.log(`⚠️  Webhook signature verification failed.`, err.message);
                return response.sendStatus(400);
            }
        }
        let subscription;
        let status;
        let checkout;
        let cust_info;
        let type;
        // Handle the event

        switch (event.type) {
            case 'checkout.session.completed':
                checkout = event.data.object;
                status = checkout.status;

                console.log(`checkout session is ${status}.`);

                break;
            case 'customer.created':
                customer = event.data.object;
                status = customer.status;
                cust_info = { cust_id: customer.id, email: customer.email };
                update_customerId(cust_info)

                break;
            case 'customer.subscription.created':
                subscription = event.data.object;
                status = subscription.status;
                console.log(subscription)
                if (subscription.plan.id == process.env.STANDARD1 || subscription.plan.id == process.env.STANDARD3)
                    type = 'standard'
                else if (subscription.plan.id == process.env.PREMIUM1 || subscription.plan.id == process.env.PREMIUM3)
                    type = 'premium'

                var info = { cust_id: subscription.customer, account_type: type }
                update_customerPlan(info)
                console.log(`Subscription created, status is ${status}.`);

                break;
            case 'customer.subscription.updated':
                subscription = event.data.object;
                status = subscription.status;
                if (subscription.plan.id == process.env.STANDARD1 || subscription.plan.id == process.env.STANDARD3)
                    type = 'standard'
                else if (subscription.plan.id == process.env.PREMIUM1 || subscription.plan.id == process.env.PREMIUM3)
                    type = 'premium'
                var info = { cust_id: subscription.customer, account_type: type }
                update_customerPlan(info)
                console.log(`Subscription updated, status is ${status}.`);
                // Then define and call a method to handle the subscription update.
                // handleSubscriptionUpdated(subscription);
                break;
            case 'customer.subscription.deleted':
                subscription = event.data.object;
                status = subscription.status;
                var info = { cust_id: subscription.customer, account_type: "free" }
                update_customerPlan(info);
                console.log(`Subscription deleted, status is ${status}.`);
                // Then define and call a method to handle the subscription deleted.
                // handleSubscriptionDeleted(subscriptionDeleted);
                break;
            default:
                // Unexpected event type
                console.log(`Unhandled event type ${event.type}.`);
        }
        // Return a 200 response to acknowledge receipt of the event
        response.status(200).send("Event receipt");
    }
);

module.exports = router;