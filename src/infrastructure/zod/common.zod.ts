import { z } from "zod";
import validator from "validator";
import { Types } from "mongoose";

// ****** Common zod validations for reuse ****** \\

// Object Id zod validation
export const objectIdField = (fieldName = "ID") =>
    z.string({
        required_error: `${fieldName} is required`,
        invalid_type_error: `${fieldName} must be a string`,
    }).refine(id => Types.ObjectId.isValid(id), {
        message: `Invalid ${fieldName} format`,
    });

// Boolean field zod validation
export const booleanField = (fieldName = "Boolean") =>
  z.boolean().refine(val => typeof val === 'boolean', {
    message: `${fieldName} status must be boolean`,
  });

// String field zod validation
export const stringField = (
  fieldName = "Value",
  min?: number,
  max?: number,
  regex?: RegExp,
  regexMessage = "Invalid format"
) => {
  let schema = z.string({
    required_error: `${fieldName} is required`,
    invalid_type_error: `${fieldName} must be a string`,
  });

  if (min !== undefined) {
    schema = schema.min(min, `${fieldName} must be at least ${min} characters`);
  }

  if (max !== undefined) {
    schema = schema.max(max, `${fieldName} must be at most ${max} characters`);
  }

  if (regex !== undefined) {
    schema = schema.regex(regex, regexMessage);
  }

  return schema;
};

// Number field zod validation
export const numberField = (
  fieldName = "Value",
  min?: number,
  max?: number
) => {
  let schema = z.number({
    required_error: `${fieldName} is required`,
    invalid_type_error: `${fieldName} must be a number`
  });

  if (min !== undefined) {
    schema = schema.min(min, `${fieldName} must be at least ${min}`);
  }

  if (max !== undefined) {
    schema = schema.max(max, `${fieldName} must be at most ${max}`);
  }

  return schema;
};

// Date zod validation
export const DateZodSchema = z.object({
    date: z.preprocess((val) => {
        if (typeof val === "string" || val instanceof String) {
            const parsed = new Date(val as string);
            if (!isNaN(parsed.getTime())) return parsed;
        }
        return val;
    }, z.date({
        required_error: "Date is required",
        invalid_type_error: "Date must be a valid Date object",
    })),
});

// User and Provider addess adding controllerz zod validation
export const AddAddressZodSchema = z.object({
    addressLine: stringField("AddressLine",10,150,/^[a-zA-Z0-9 .,#-]{10,150}$/,"Address line must be 10–150 characters long and can only include letters, numbers, spaces, and the symbols . , # -") ,
    phone: stringField("Phone",10,15,/^\+\d{10,15}$/, "Invalid phone number"),
    place: stringField("Place",3,50,/^[a-zA-Z .-]{3,50}$/, "Place name must be 3–50 characters long and can only include letters, spaces, dots, and hyphens"),
    city: stringField("City",3,50,/^[a-zA-Z ]{3,50}$/,"City must only contain letters and spaces"),
    district: stringField("District",2,50,/^[a-zA-Z ]{3,50}$/,"District must only contain letters and spaces"),
    pincode: stringField("pincode",3,12,/^[A-Za-z0-9\s-]{3,12}$/,"Invalid postal code"),
    state: stringField("State",2,50,/^[a-zA-Z ]{2,50}$/,"State must only contain letters and spaces"),
    country: stringField("Country",2,50,/^[a-zA-Z ]{2,50}$/,"Country must only contain letters and spaces"),
    googleMapLink: z.string({
      required_error: "Google Map link is required",
      invalid_type_error: "Google Map link must be a string",
    })
    .url("Invalid Google Map link")
    .refine((val) => val.startsWith("https://maps.app.goo.gl/"), {
      message: "Link must be from Google Maps (maps.app.goo.gl)",
    }),
});

// user or provider username and phone updation controller
export const UserOrProviderUpdateInfoZodSchema = z.object({
    username: stringField("Username",4,30,/^[a-zA-Z ]{4,30}$/,"Invalid username"),
    phone: stringField("Phone",10,15,/^\+\d{10,15}$/, "Invalid phone number")
});

// Stripe Payment Schema
export const SaveStripePaymentZodSchema = z.object({
    sessionId: stringField("Stripe session Id",5,200,/^cs_test_[a-zA-Z0-9]{5,200}$/,"Invalid session ID")
});

