import { z } from "zod";
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

// Date common field
export const dateField = z.preprocess(
  (val) => {
    if (typeof val === "string" || val instanceof String) {
      const parsed = new Date(val as string);
      if (!isNaN(parsed.getTime())) return parsed;
    }
    return val;
  },
  z.date({
    required_error: "Date is required",
    invalid_type_error: "Date must be a valid Date object",
  })
);

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

// String enum field
export const enumField = (fieldName: string, values: readonly string[]) =>
  z.enum(values as [string, ...string[]], {
    required_error: `${fieldName} is required`,
    invalid_type_error: `${fieldName} must be one of: ${values.join(", ")}`,
  });

// String enum field
export const stringArrayField = (
  fieldName = "Value",
  arrayMin?: number,
  arrayMax?: number,
  itemMin?: number,
  itemMax?: number,
  regex?: RegExp,
  regexMessage = "Invalid format"
) => {
  let itemSchema = z.string({
    required_error: `${fieldName} item is required`,
    invalid_type_error: `${fieldName} item must be a string`,
  });

  if (itemMin !== undefined) {
    itemSchema = itemSchema.min(itemMin, `${fieldName} item must be at least ${itemMin} characters`);
  }

  if (itemMax !== undefined) {
    itemSchema = itemSchema.max(itemMax, `${fieldName} item must be at most ${itemMax} characters`);
  }

  if (regex !== undefined) {
    itemSchema = itemSchema.regex(regex, regexMessage);
  }

  let arraySchema = z.array(itemSchema);

  if (arrayMin !== undefined) {
    arraySchema = arraySchema.min(arrayMin, `At least ${arrayMin} ${fieldName.toLowerCase()}(s) required`);
  }

  if (arrayMax !== undefined) {
    arraySchema = arraySchema.max(arrayMax, `At most ${arrayMax} ${fieldName.toLowerCase()}(s) allowed`);
  }

  return arraySchema;
};

// Date zod validation alone for the date coming in req.query
export const DateZodSchema = z.object({
    date: dateField,
});

// User and Provider addess adding controllerz zod validation
export const AddAddressZodSchema = z.object({
    addressLine: stringField("AddressLine",10,150,/^[a-zA-Z0-9 .,#-]{10,150}$/,"Address line must be 10–150 characters long and can only include letters, numbers, spaces, and the symbols . , # -") ,
    phone: stringField("Phone",7,20,/^\+?[0-9\s\-().]{7,20}$/, "Invalid phone number. Only digits, spaces, dashes (-), dots (.), parentheses (), and an optional + at the beginning are allowed. Length must be between 7 to 20 characters."),
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
    phone: stringField("Phone",7,20,/^\+?[0-9\s\-().]{7,20}$/, "Invalid phone number. Only digits, spaces, dashes (-), dots (.), parentheses (), and an optional + at the beginning are allowed. Length must be between 7 to 20 characters."),
});

// Stripe Payment Schema
export const SaveStripePaymentZodSchema = z.object({
    sessionId: stringField("Stripe session Id",5,200,/^cs_test_[a-zA-Z0-9]{5,200}$/,"Invalid session ID")
});

