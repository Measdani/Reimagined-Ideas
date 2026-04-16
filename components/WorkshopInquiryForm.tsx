"use client";

import { FormEvent, useRef, useState } from "react";

const programOptions = [
  "1-day spotlight workshop",
  "Summer series",
  "After-school or enrichment program",
  "School-day workshop",
  "Custom format",
];

const gradeOptions = [
  "Grades 3-5",
  "Grades 6-8",
  "Mixed elementary and middle school",
  "Another age range",
];

type FormFeedback =
  | {
      type: "idle";
      message: "";
    }
  | {
      type: "success" | "error";
      message: string;
    };

const initialFeedback: FormFeedback = {
  type: "idle",
  message: "",
};

export function WorkshopInquiryForm() {
  const formRef = useRef<HTMLFormElement>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [feedback, setFeedback] = useState<FormFeedback>(initialFeedback);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmitting) {
      return;
    }

    setIsSubmitting(true);
    setFeedback(initialFeedback);

    const formData = new FormData(event.currentTarget);
    const payload = {
      contactName: String(formData.get("contactName") ?? ""),
      organizationName: String(formData.get("organizationName") ?? ""),
      email: String(formData.get("email") ?? ""),
      phone: String(formData.get("phone") ?? ""),
      programType: String(formData.get("programType") ?? ""),
      studentGrades: String(formData.get("studentGrades") ?? ""),
      estimatedStudents: String(formData.get("estimatedStudents") ?? ""),
      timeline: String(formData.get("timeline") ?? ""),
      location: String(formData.get("location") ?? ""),
      message: String(formData.get("message") ?? ""),
    };

    try {
      const response = await fetch("/api/workshop-inquiry", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      const result = (await response.json().catch(() => null)) as
        | { message?: string; error?: string }
        | null;

      if (!response.ok) {
        throw new Error(
          result?.error ??
            "Something went wrong while sending your request. Please try again.",
        );
      }

      formRef.current?.reset();
      setFeedback({
        type: "success",
        message:
          result?.message ??
          "Thanks for reaching out. Your workshop request is on the way.",
      });
    } catch (error) {
      const message =
        error instanceof Error
          ? error.message
          : "We could not send your request right now. Please try again.";

      setFeedback({
        type: "error",
        message,
      });
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="inquiry-panel">
      <div className="inquiry-panel-header">
        <p className="card-label">Request a quote</p>
        <h3>Tell us about your program and we&apos;ll follow up with pricing and next steps.</h3>
        <p className="card-text">
          Share the basics below and Reimagined Ideas can recommend the right format,
          availability, and workshop scope for your group.
        </p>
      </div>

      <form className="inquiry-form" onSubmit={handleSubmit} ref={formRef}>
        <div className="form-grid">
          <label className="form-field">
            <span>Your name</span>
            <input name="contactName" type="text" placeholder="Jordan Lee" required />
          </label>

          <label className="form-field">
            <span>Organization</span>
            <input
              name="organizationName"
              type="text"
              placeholder="Bright Future Summer Camp"
              required
            />
          </label>

          <label className="form-field">
            <span>Email address</span>
            <input
              name="email"
              type="email"
              placeholder="name@organization.com"
              required
            />
          </label>

          <label className="form-field">
            <span>Phone number</span>
            <input name="phone" type="tel" placeholder="(555) 123-4567" />
          </label>

          <label className="form-field">
            <span>Program type</span>
            <select defaultValue="" name="programType" required>
              <option disabled value="">
                Select a format
              </option>
              {programOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            <span>Student grades</span>
            <select defaultValue="" name="studentGrades" required>
              <option disabled value="">
                Select a grade range
              </option>
              {gradeOptions.map((option) => (
                <option key={option} value={option}>
                  {option}
                </option>
              ))}
            </select>
          </label>

          <label className="form-field">
            <span>Estimated students</span>
            <input name="estimatedStudents" min="1" placeholder="40" type="number" required />
          </label>

          <label className="form-field">
            <span>Location</span>
            <input name="location" placeholder="Brooklyn, NY" type="text" required />
          </label>

          <label className="form-field field-span-full">
            <span>Ideal dates or timeframe</span>
            <input
              name="timeline"
              placeholder="July 2026, weekdays preferred"
              type="text"
              required
            />
          </label>

          <label className="form-field field-span-full">
            <span>Tell us what you need</span>
            <textarea
              name="message"
              placeholder="Share your goals, schedule, number of sessions, or anything helpful for a quote."
              required
              rows={5}
            />
          </label>
        </div>

        <div className="form-footer">
          <p className="form-note">
            You can also email{" "}
            <a href="mailto:contact@reimaginedideas.com">contact@reimaginedideas.com</a>{" "}
            directly if you prefer.
          </p>

          <button className="button button-primary" disabled={isSubmitting} type="submit">
            {isSubmitting ? "Sending..." : "Request a Quote"}
          </button>
        </div>

        {feedback.type !== "idle" ? (
          <p className={`form-status form-status-${feedback.type}`} role="status">
            {feedback.message}
          </p>
        ) : null}
      </form>
    </div>
  );
}
