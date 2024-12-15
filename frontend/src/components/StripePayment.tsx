import React, { useState } from "react";
import { loadStripe } from "@stripe/stripe-js";
import { Elements, CardElement, useStripe, useElements } from "@stripe/react-stripe-js";
import axios from "axios";
import { BACKEND_PREFIX } from "../App";
import { Button, Form, FormGroup, Label, Input } from "reactstrap";

const stripePromise = loadStripe("pk_test_51QWNyO2MHFP3dlqLAsJ82dvxjiTt5Ze66YAGinnhEkktozDshEnmheFQ4tEutl14wFSE3W6B2zluEmRbssgFf7Ep005L8Jj2Th");

const CheckoutForm = ({ bankAccountNumber }: { bankAccountNumber: string }) => {
    const stripe = useStripe();
    const elements = useElements();
    const [amount, setAmount] = useState<number>(0);
    const [error, setError] = useState<string | null>(null);
    const [success, setSuccess] = useState<string | null>(null);

    const handleSubmit = async (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault();

        if (!stripe || !elements) {
            return;
        }

        try {
            const { data: clientSecret } = await axios.post(`${BACKEND_PREFIX}/api/payments/create-payment-intent`, { amount });

            const result = await stripe.confirmCardPayment(clientSecret.clientSecret, {
                payment_method: {
                    card: elements.getElement(CardElement)!,
                },
            });

            if (result.error) {
                setError(result.error.message || "Payment failed");
            } else if (result.paymentIntent?.status === "succeeded") {
                await axios.post(`${BACKEND_PREFIX}/api/payments/confirm-payment`, {
                    paymentIntentId: result.paymentIntent.id,
                    bankAccountNumber,
                    amount,
                });
                setSuccess("Payment successful and funds added!");
            }
        } catch (err) {
            setError("Payment failed");
        }
    };

    return (
        <Form onSubmit={handleSubmit}>
            <FormGroup>
                <Label for="amount">Amount</Label>
                <Input
                    type="number"
                    id="amount"
                    value={amount}
                    onChange={(e) => setAmount(parseInt(e.target.value))}
                    required
                />
            </FormGroup>
            <FormGroup>
                <Label for="card">Card Details</Label>
                <CardElement id="card" />
            </FormGroup>
            <Button type="submit" disabled={!stripe}>Pay</Button>
            {error && <div className="text-danger">{error}</div>}
            {success && <div className="text-success">{success}</div>}
        </Form>
    );
};

const StripePayment = ({ bankAccountNumber }: { bankAccountNumber: string }) => (
    <Elements stripe={stripePromise}>
        <CheckoutForm bankAccountNumber={bankAccountNumber} />
    </Elements>
);

export default StripePayment;