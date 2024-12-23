import {
  Html,
  Head,
  Font,
  Preview,
  Heading,
  Row,
  Section,
  Text,
  Button,
  Container,
  Body,
  Column,
} from "@react-email/components";

interface VerificationEmailProps {
  username: string;
  verificationCode: string;
}

export default function VerificationEmail({
  username,
  verificationCode,
}: VerificationEmailProps) {
  return (
    <Html lang="en" dir="ltr">
      <Head>
        <title>Verification Code</title>
        <Font
          fontFamily="Roboto"
          fallbackFontFamily="Verdana"
          webFont={{
            url: "https://fonts.gstatic.com/s/roboto/v27/KFOmCnqEu92Fr1Mu4mxKKTU1Kg.woff2",
            format: "woff2",
          }}
          fontWeight={400}
          fontStyle="normal"
        />
      </Head>
      <Preview>
        Welcome to TrueFeedback! Your verification code: {verificationCode}
      </Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={logo}>
            <img
              src="https://your-logo-url.png"
              width="170"
              height="50"
              alt="TrueFeedback"
            />
          </Section>
          <Section style={content}>
            <Heading as="h2" style={heading}>
              Welcome {username}! 👋
            </Heading>
            <Text style={paragraph}>
              Thank you for joining TrueFeedback. To complete your registration,
              please use the verification code below:
            </Text>
            <Section style={codeContainer}>
              <Text style={code}>{verificationCode}</Text>
            </Section>
            <Text style={paragraph}>
              This code will expire in 10 minutes. If you didn't request this
              code, please ignore this email.
            </Text>
            <Text style={footer}>
              Best regards,
              <br />
              The TrueFeedback Team
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f6f9fc",
  fontFamily: 'Roboto, "Helvetica Neue", Ubuntu, Arial, sans-serif',
};

const container = {
  backgroundColor: "#ffffff",
  margin: "0 auto",
  padding: "20px 0 48px",
  marginBottom: "64px",
  borderRadius: "5px",
  maxWidth: "580px",
};

const logo = {
  margin: "0 auto",
  marginBottom: "30px",
  padding: "20px 0",
  textAlign: "center" as const,
};

const content = {
  padding: "0 48px",
};

const heading = {
  fontSize: "32px",
  fontWeight: "300",
  color: "#1f2937",
  marginBottom: "30px",
};

const paragraph = {
  fontSize: "16px",
  lineHeight: "26px",
  color: "#4b5563",
};

const codeContainer = {
  background: "#f3f4f6",
  borderRadius: "5px",
  padding: "20px 0",
  margin: "30px 0",
  textAlign: "center" as const,
};

const code = {
  fontSize: "36px",
  fontWeight: "700",
  color: "#1f2937",
  letterSpacing: "6px",
};

const footer = {
  fontSize: "14px",
  lineHeight: "24px",
  color: "#4b5563",
  marginTop: "32px",
};
