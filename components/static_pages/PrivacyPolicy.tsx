"use client";

import { Mail, MessageCircle } from "lucide-react";
import Link from "next/link";

const PrivacyPolicy = () => {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-950 py-16 px-6 flex justify-center">
      <div className="max-w-3xl w-full bg-white dark:bg-gray-900 shadow-md rounded-2xl p-8 sm:p-12 border border-gray-200 dark:border-gray-800">
        <h1 className="text-3xl font-bold text-center text-gray-800 dark:text-white mb-2">
          Privacy Policy
        </h1>
        <p className="text-center text-sm text-gray-500 dark:text-gray-400 mb-8">
          Last updated: October 29, 2025 • Effective date: October 29, 2025
        </p>

        <div className="space-y-8 text-gray-700 dark:text-gray-300 leading-relaxed">
          <section>
            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
              1. Introduction
            </h2>
            <p>
              Welcome to{" "}
              <a
                href="https://nepal-election.vercel.app/"
                title="Nepal Pre-Election 2082"
                aria-label="Vote for candidate"
              >
                <strong>Nepal Pre-Election 2082</strong>
              </a>
              . We respect your privacy and are committed to protecting your
              personal data. This Privacy Policy explains how we collect, use,
              disclose, and safeguard your information when you visit our
              Website.
            </p>
            <p className="mt-2">
              By using or accessing the Website, you accept and consent to the
              practices described in this policy.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
              2. Who we are
            </h2>
            <p>
              The Website is operated by{" "}
              <a
                href="https://nepal-election.vercel.app/"
                title="Nepal Pre-Election 2082"
                aria-label="Vote for candidate"
              >
                <strong>Nepal Pre-Election 2082</strong>
              </a>
              , managed by [Insert Operator/Organization Name]. If you have any
              questions about this policy, contact us at{" "}
              <a
                href="mailto:praspaudel@gmail.com"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                praspaudel@gmail.com
              </a>
              .
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
              3. Information we collect
            </h2>
            <h3 className="font-medium mt-2">
              3.1 Information you provide directly
            </h3>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>
                Identifiers such as your name, email address, or login ID when
                logging in.
              </li>
              <li>Your name, province, and group when nominating or voting.</li>
              <li>Your name, email address, and message when contacting us.</li>
            </ul>

            <h3 className="font-medium mt-4">
              3.2 Information collected automatically
            </h3>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>
                Technical data such as IP address, browser, device type, and
                operating system.
              </li>
              <li>
                Cookies or similar tracking technologies for improving
                functionality and usage analysis.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
              4. How we use your information
            </h2>
            <ul className="list-disc list-inside ml-4 space-y-1">
              <li>Operate and maintain the Website.</li>
              <li>Enable user registration, nomination, and voting.</li>
              <li>Communicate with users.</li>
              <li>Analyse and improve performance and user experience.</li>
              <li>Ensure Website security and prevent misuse.</li>
              <li>Comply with legal requirements.</li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
              5. Sharing your information
            </h2>
            <p>We do not sell your personal data. We may share your data:</p>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>With service providers who help operate the Website.</li>
              <li>To comply with legal obligations or government requests.</li>
              <li>
                If the Website is transferred as part of a merger or
                acquisition.
              </li>
            </ul>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
              6. Cookies and tracking
            </h2>
            <p>
              Cookies help us recognise returning visitors and understand user
              behaviour. You may disable cookies in your browser settings, but
              some features may not function properly.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
              7. Data retention
            </h2>
            <p>
              We keep your data only as long as needed for the purposes outlined
              in this Privacy Policy or as required by law. Data no longer
              required will be deleted or anonymised.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
              8. International transfers
            </h2>
            <p>
              Your data may be transferred to or stored in countries other than
              your own. By using the Website, you consent to such transfers.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
              9. Security
            </h2>
            <p>
              We use appropriate technical and organisational safeguards to
              protect your personal data. No method of storage or transmission
              is completely secure, so absolute protection cannot be guaranteed.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
              10. Your rights
            </h2>
            <p>Depending on your jurisdiction, you may have the right to:</p>
            <ul className="list-disc list-inside ml-4 mt-1 space-y-1">
              <li>Access or update your data.</li>
              <li>Request deletion of your data.</li>
              <li>Object to or restrict processing.</li>
              <li>Withdraw consent where applicable.</li>
            </ul>
            <p className="mt-2">
              Contact{" "}
              <a
                href="mailto:praspaudel@gmail.com"
                className="text-blue-600 dark:text-blue-400 hover:underline"
              >
                praspaudel@gmail.com
              </a>{" "}
              to make a request. Verification of identity may be required.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
              11. Children’s privacy
            </h2>
            <p>
              The Website is not directed to children under 13 years of age, and
              we do not knowingly collect their personal data. If a child’s data
              has been collected, contact us to request deletion.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
              12. Changes to this Privacy Policy
            </h2>
            <p>
              We may update this Privacy Policy from time to time. The “Last
              updated” date above reflects the most recent revision. Continued
              use of the Website after updates means you accept the revised
              terms.
            </p>
          </section>

          <section>
            <h2 className="text-xl font-semibold text-blue-600 dark:text-blue-400 mb-2">
              13. Contact us
            </h2>
            <p>
              For any questions or concerns about this Privacy Policy, contact:
              <br />
              <span className="font-medium">Email:</span> {/* Email */}
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
    </div>
  );
};
export default PrivacyPolicy;
