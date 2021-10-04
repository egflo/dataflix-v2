import { Stripe, loadStripe } from '@stripe/stripe-js';

let stripePromise: Promise<Stripe | null>;
const getStripe = () => {
    if (!stripePromise) {
        stripePromise = loadStripe("pk_test_51J3qCqBVPvYzs7uWw0nbrKwdIZWg0hmaYHEABbUirTZqQR2TftCxjMBRJhBlVIQbvYLTWDrUXt2WZnzVbY2BNfye0055McVHXT");
    }
    return stripePromise;
};

export default getStripe;