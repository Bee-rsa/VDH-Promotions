import express from "express";
import dotenv from "dotenv";
import cookieParser from "cookie-parser";
import path from "path";
import paypal from "paypal-rest-sdk";
import cors from "cors";

import authRoutes from "./routes/auth.route.js";
import productRoutes from "./routes/product.route.js";
import cartRoutes from "./routes/cart.route.js";
import analyticsRoutes from "./routes/analytics.route.js";

import { connectDB } from "./lib/db.js";

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());
app.use(express.json({ limit: "10mb" }));
app.use(cookieParser());

// PayPal configuration
paypal.configure({
    mode: 'sandbox',
    client_id: "AdP6gFoFOyNYdmrbDHkcO2mVeARd5SPGibVrrCTqEocpLUgjbhooLUClgU7vovcV2em-Ey-3gGq18Quq",
    client_secret: 'EMjL66hsdS3wt5tqK4Cuq7peR_AMdDmDP3_u9jergS08AH3U5Yef4o_fg5KDDqctF31Fzyysa7Sg3-gK',
});

// Payment creation route
app.post("/payment", async (req, res) => {
  try {
    const { totalAmount } = req.body; // Get the dynamic totalAmount from the frontend

    if (typeof totalAmount !== "number" || totalAmount <= 0) {
      throw new Error("Invalid totalAmount. It must be a positive number.");
    }

    // Create the payment JSON dynamically
    const create_payment_json = {
      intent: "sale",
      payer: {
        payment_method: "paypal",
      },
      redirect_urls: {
        return_url: "http://localhost:5173/success",
        cancel_url: "http://localhost:5173/failed",
      },
      transactions: [
        {
          item_list: {
            items: [
              {
                name: "Printing Service",
                sku: "PRINT001",
                price: totalAmount.toFixed(2),
                currency: "USD",
                quantity: 1,
              },
            ],
          },
          amount: {
            currency: "USD",
            total: totalAmount.toFixed(2),
          },
          description: "Payment for printing services.",
        },
      ],
    };

    // Create PayPal payment
    paypal.payment.create(create_payment_json, function (error, payment) {
      if (error) {
        console.error("PayPal Error:", error);
        return res.status(500).json({ error: "Failed to create PayPal payment", details: error.response });
      } else {
        console.log("PayPal Payment Created:", payment);
        res.json(payment);
      }
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.status(500).json({ error: "Internal server error", details: error.message });
  }
});

// Payment execution route
app.get("/success", async (req, res) => {
  try {
    const { paymentId, token, PayerID } = req.query;

    if (!paymentId || !PayerID) {
      console.error("Missing paymentId or PayerID");
      return res.redirect("http://localhost:5173/failed");
    }

    // Execute the payment
    const execute_payment_json = {
      payer_id: PayerID,
    };

    paypal.payment.execute(paymentId, execute_payment_json, function (error, payment) {
      if (error) {
        console.error("PayPal Error - Execute Payment:", error);
        return res.redirect("http://localhost:5173/failed");
      } else {
        console.log("Payment Executed Successfully:", JSON.stringify(payment));
        // After execution, redirect to static success page (without query parameters)
		return res.redirect("http://localhost:5173/success");
      }
    });
  } catch (error) {
    console.error("Server Error:", error);
    res.redirect("http://localhost:5173/failed");
  }
});

// Failed payment route
app.get('/failed', async (req, res) => {
  return res.redirect("http://localhost:5173/failed");
});

// Serve frontend in production
const __dirname = path.resolve();
if (process.env.NODE_ENV === "production") {
  app.use(express.static(path.join(__dirname, "/frontend/dist")));

  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "frontend", "dist", "index.html"));
  });
}

app.use("/api/auth", authRoutes);
app.use("/api/products", productRoutes);
app.use("/api/cart", cartRoutes);
app.use("/api/analytics", analyticsRoutes);

app.listen(PORT, () => {
  console.log("Server is running on http://localhost:" + PORT);
  connectDB();
});
