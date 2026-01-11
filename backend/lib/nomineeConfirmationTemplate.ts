// eslint-disable-next-line @typescript-eslint/no-explicit-any
export const nomineeConfirmationTemplate = (nominee: any) => {
  return `
<!DOCTYPE html>
<html>
<head>
  <meta charset="UTF-8">
  <title>Nomination Successful</title>
</head>

<body style="margin:0;padding:0;background:#f4f4f4;font-family:Arial, sans-serif;">

  <table width="100%" cellpadding="0" cellspacing="0"
    style="
      padding:20px 0;
      background-image:url('data:image/jpeg;base64,REPLACE_BASE64_HERE');
      background-size:cover;
      background-position:center;
      background-repeat:no-repeat;
    ">
    <tr>
      <td align="center">

        <table width="620" cellpadding="0" cellspacing="0"
          style="
            background:rgba(255,255,255,0.92);
            border-radius:10px;
            border:6px solid #ce1126;
            box-sizing:border-box;
            padding:0;
            backdrop-filter: blur(3px);
          ">
          <tr>
            <td>

              <table width="100%" cellpadding="0" cellspacing="0"
                style="
                  border:3px solid #003893;
                  border-radius:6px;
                  overflow:hidden;
                ">

                <!-- Header -->
                <tr>
                  <td style="background:#ce1126;color:#fff;text-align:center;padding:26px 0;font-size:28px;font-weight:bold;">
                    🇳🇵 Nomination Successful!
                  </td>
                </tr>

                <tr>
                  <td style="background:#003893;color:#fff;text-align:center;padding:12px 0;font-size:15px;">
                    Thank you for your contribution to democracy ❤️💙
                  </td>
                </tr>

                <!-- Content -->
                <tr>
                  <td style="padding:26px;color:#333;font-size:15px;line-height:22px;">

                    <p>Dear supporter,</p>

                    <p>
                      Thank you for nominating
                      <strong>${nominee.name} ${nominee.surname}</strong>.
                      We have received the information and the image successfully.
                    </p>

                    <p>
                      Our team will now review the details before officially
                      validating the nomination. Your participation directly
                      contributes to strengthening democratic values. 🙏
                    </p>

                    <!-- Nominee Card -->
                    <table width="100%" cellpadding="0" cellspacing="0"
                      style="
                        margin-top:20px;
                        border:1px solid #ddd;
                        border-radius:8px;
                        overflow:hidden;
                        background:#fafafa;
                      ">
                      <tr>
                        <td width="140" style="padding:12px;">
                          <img src="${
                            nominee.avatar?.url ||
                            "https://via.placeholder.com/130"
                          }"
                            alt="Nominee Photo"
                            style="width:130px;height:130px;border-radius:8px;object-fit:cover;border:2px solid #eee;">
                        </td>

                        <td style="padding:12px;font-size:14px;color:#333;line-height:20px;">
                          <strong>Name:</strong> ${nominee.name} ${
    nominee.surname
  }<br/>
                          <strong>Age:</strong> ${nominee.age}<br/>
                          <strong>Group:</strong> ${nominee.group}<br/>
                          <strong>Party:</strong> ${
                            nominee.party || "Independent"
                          }<br/>
                          <strong>Province:</strong> ${nominee.province}<br/>
                          <strong>District:</strong> ${
                            nominee.address?.district || "-"
                          }<br/>
                          <strong>Municipality:</strong> ${
                            nominee.address?.municipality || "-"
                          }<br/>
                          <strong>Ward:</strong> ${
                            nominee.address?.ward || "-"
                          }<br/>
                          ${
                            nominee.address?.tole
                              ? `<strong>Tole:</strong> ${nominee.address.tole}<br/>`
                              : ""
                          }
                        </td>
                      </tr>
                    </table>

                    <p style="margin-top:22px;">
                      Keep this email for your records. No further action is required at this moment.
                    </p>

                  </td>
                </tr>

                <!-- Note -->
                <tr>
                  <td style="padding:20px;text-align:center;font-size:13px;color:#666;">
                    This email is automatically generated. Please do not reply.
                  </td>
                </tr>

                <!-- Footer -->
                <tr>
                  <td style="background:#ce1126;color:#fff;text-align:center;padding:16px;font-size:12px;">
                    © ${new Date().getFullYear()} Votenepal.net 🇳🇵
                  </td>
                </tr>

              </table>

            </td>
          </tr>
        </table>

      </td>
    </tr>
  </table>

</body>
</html>
`;
};
