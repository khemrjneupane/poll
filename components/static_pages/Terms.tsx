"use client";

import { Mail, MessageCircle } from "lucide-react";
import Link from "next/link";

export default function Terms() {
  return (
    <div className="max-w-4xl mx-auto py-12 px-6 text-gray-800 dark:text-gray-100 min-h-screen bg-gray-50 dark:bg-gray-900">
      <h1 className="text-3xl font-bold text-center mb-2">Terms of Service</h1>
      <p className="text-center text-gray-500 dark:text-gray-400 mb-10">
        Last updated: October 29, 2025 <br />
        Effective date: October 29, 2025
      </p>

      <div className="space-y-8 leading-relaxed">
        <section>
          <h2 className="text-xl font-semibold mb-2">1. Acceptance of Terms</h2>
          <p>
            By accessing or using <strong>Nepal Pre-Election 2082</strong> (the
            “Website”), you agree to these Terms of Service and all applicable
            laws. If you do not agree, do not use this Website.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            2. Purpose of the Website
          </h2>
          <p>
            Nepal Pre-Election 2082 provides an online platform where users can
            view, nominate, and vote for political candidates and parties before
            the national election. The Website is for informational and public
            engagement purposes only.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">3. Eligibility</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Be at least 13 years old.</li>
            <li>Agree to provide accurate and truthful information.</li>
            <li>Use the Website for lawful purposes only.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">4. User Accounts</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>
              You are responsible for keeping your account credentials secure.
            </li>
            <li>You must not share your login details with others.</li>
            <li>You are responsible for all activities under your account.</li>
            <li>
              We reserve the right to suspend or terminate accounts for misuse
              or violations of these Terms.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            5. User Responsibilities
          </h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>Submit false or misleading information.</li>
            <li>
              Use automated tools, scripts, or bots to manipulate voting or
              content.
            </li>
            <li>Interfere with the Website’s functionality or security.</li>
            <li>Attempt to gain unauthorised access to systems or data.</li>
            <li>
              Post or distribute unlawful, harmful, or offensive material.
            </li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            6. Voting and Data Accuracy
          </h2>
          <p>
            The Website aims to provide fair and transparent pre-election
            participation. We do not guarantee the accuracy or completeness of
            user-submitted data, candidate details, or vote counts. Votes and
            nominations are for survey and engagement purposes only, not for
            official election outcomes.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            7. Intellectual Property
          </h2>
          <p>
            All content on this Website, including text, graphics, logos, and
            code, is the property of Nepal Pre-Election 2082 or its content
            providers. You may not copy, reproduce, or distribute Website
            content without written permission.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            8. Third-Party Services
          </h2>
          <p>
            The Website may include links to external websites or services. We
            are not responsible for the content or actions of third-party sites.
            Your use of third-party sites is at your own risk and subject to
            their policies.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">9. Privacy</h2>
          <p>
            Your use of the Website is also governed by our{" "}
            <a
              href="/privacy-policy"
              className="text-blue-600 hover:text-blue-800 underline"
            >
              Privacy Policy
            </a>
            . Please review it to understand how we collect and use your data.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">10. Disclaimers</h2>
          <ul className="list-disc pl-6 space-y-1">
            <li>The Website is provided “as is” and “as available.”</li>
            <li>
              We do not guarantee uninterrupted, secure, or error-free
              operation.
            </li>
            <li>
              We do not endorse or verify opinions or content shared by users.
            </li>
            <li>You use the Website at your own risk.</li>
          </ul>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            11. Limitation of Liability
          </h2>
          <p>
            To the maximum extent permitted by law, Nepal Pre-Election 2082 and
            its operators are not liable for any loss or damage resulting from
            Website use or inability to use the Website, data loss, technical
            issues, or security breaches, or user actions, content, or reliance
            on Website information.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">12. Termination</h2>
          <p>
            We reserve the right to suspend or terminate access to the Website
            without prior notice if we believe you have violated these Terms or
            engaged in harmful behaviour.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">13. Changes to Terms</h2>
          <p>
            We may update these Terms at any time. Revised Terms will be posted
            on this page with an updated date. Continued use of the Website
            means you accept the updated Terms.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">14. Governing Law</h2>
          <p>
            These Terms are governed by the laws of Nepal, without regard to
            conflict of law principles. Disputes arising under these Terms will
            be handled in the appropriate courts of Nepal.
          </p>
        </section>

        <section>
          <h2 className="text-xl font-semibold mb-2">
            15. Contact Information
          </h2>
          <p>
            For any questions or concerns about this Privacy Policy, contact:
            <br />
            {/* Email */}
            <Link
              href="mailto:praspaudel@gmail.com"
              className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-blue-600 transition-colors"
            >
              <Mail className="w-5 h-5 text-blue-500" />
              <span className="font-medium">praspaudel@gmail.com</span>
            </Link>
            {/* WhatsApp */}
            <Link
              href="https://wa.me/358449731609"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-gray-700 dark:text-gray-200 hover:text-green-600 transition-colors"
            >
              <MessageCircle className="w-5 h-5 text-green-500" />
              <span className="font-medium">WhatsApp</span>
            </Link>
          </p>
        </section>
      </div>
    </div>
  );
}
