import Stripe from "stripe";
import { STRIPE_SECRET_KEY } from "./env.config";

export const stripe = new Stripe(STRIPE_SECRET_KEY)