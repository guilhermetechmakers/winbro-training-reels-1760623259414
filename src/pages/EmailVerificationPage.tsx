import { useState, useEffect } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { CheckCircle, XCircle, Loader2, Mail, RefreshCw } from "lucide-react";

export default function EmailVerificationPage() {
  const [searchParams] = useSearchParams();
  const [status, setStatus] = useState<'verifying' | 'success' | 'error' | 'expired'>('verifying');
  const [isResending, setIsResending] = useState(false);
  const [resendSuccess, setResendSuccess] = useState(false);
  
  const token = searchParams.get('token');
  const email = searchParams.get('email');

  useEffect(() => {
    if (token) {
      verifyEmail(token);
    } else {
      setStatus('error');
    }
  }, [token]);

  const verifyEmail = async (_verificationToken: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Simulate different outcomes for demo
      const random = Math.random();
      if (random > 0.2) {
        setStatus('success');
      } else if (random > 0.1) {
        setStatus('expired');
      } else {
        setStatus('error');
      }
    } catch (error) {
      setStatus('error');
    }
  };

  const resendVerification = async () => {
    if (!email) return;
    
    setIsResending(true);
    setResendSuccess(false);
    
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      setResendSuccess(true);
    } catch (error) {
      // Handle error
    } finally {
      setIsResending(false);
    }
  };

  const getStatusContent = () => {
    switch (status) {
      case 'verifying':
        return {
          icon: <Loader2 className="h-12 w-12 text-primary animate-spin" />,
          title: "Verifying Your Email",
          description: "Please wait while we verify your email address...",
          showActions: false
        };
      
      case 'success':
        return {
          icon: <CheckCircle className="h-12 w-12 text-success" />,
          title: "Email Verified Successfully!",
          description: "Your email has been verified. You can now access all features of Winbro Training.",
          showActions: true,
          primaryAction: { text: "Go to Dashboard", href: "/dashboard" }
        };
      
      case 'expired':
        return {
          icon: <XCircle className="h-12 w-12 text-warning" />,
          title: "Verification Link Expired",
          description: "This verification link has expired. Please request a new one to verify your email.",
          showActions: true,
          primaryAction: { text: "Resend Verification", action: resendVerification }
        };
      
      case 'error':
        return {
          icon: <XCircle className="h-12 w-12 text-destructive" />,
          title: "Verification Failed",
          description: "We couldn't verify your email address. The link may be invalid or expired.",
          showActions: true,
          primaryAction: { text: "Resend Verification", action: resendVerification }
        };
      
      default:
        return {
          icon: <XCircle className="h-12 w-12 text-destructive" />,
          title: "Verification Error",
          description: "An unexpected error occurred during verification.",
          showActions: true,
          primaryAction: { text: "Try Again", action: () => window.location.reload() }
        };
    }
  };

  const statusContent = getStatusContent();

  return (
    <div className="min-h-screen bg-gradient-mesh flex items-center justify-center p-4">
      <Card className="w-full max-w-md animate-fade-in-up">
        <CardHeader className="text-center">
          <div className="mx-auto w-20 h-20 bg-muted rounded-full flex items-center justify-center mb-4">
            {statusContent.icon}
          </div>
          <CardTitle className="text-2xl">{statusContent.title}</CardTitle>
          <CardDescription className="text-base">
            {statusContent.description}
          </CardDescription>
        </CardHeader>
        
        <CardContent className="space-y-4">
          {resendSuccess && (
            <Alert className="border-success">
              <CheckCircle className="h-4 w-4" />
              <AlertDescription>
                A new verification email has been sent to {email}
              </AlertDescription>
            </Alert>
          )}

          {statusContent.showActions && (
            <div className="space-y-3">
              {statusContent.primaryAction?.href ? (
                <Button asChild className="w-full">
                  <Link to={statusContent.primaryAction.href}>
                    {statusContent.primaryAction.text}
                  </Link>
                </Button>
              ) : statusContent.primaryAction?.action ? (
                <Button 
                  onClick={statusContent.primaryAction.action}
                  disabled={isResending}
                  className="w-full"
                >
                  {isResending ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Sending...
                    </>
                  ) : (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4" />
                      {statusContent.primaryAction.text}
                    </>
                  )}
                </Button>
              ) : null}

              {status === 'success' && (
                <div className="text-center">
                  <Link 
                    to="/login" 
                    className="text-sm text-muted-foreground hover:text-primary transition-colors"
                  >
                    Or sign in with a different account
                  </Link>
                </div>
              )}

              {(status === 'expired' || status === 'error') && (
                <div className="text-center space-y-2">
                  <p className="text-sm text-muted-foreground">
                    Didn't receive the email? Check your spam folder or try again.
                  </p>
                  <div className="flex items-center justify-center space-x-2 text-sm text-muted-foreground">
                    <Mail className="h-4 w-4" />
                    <span>{email}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {status === 'verifying' && (
            <div className="text-center">
              <p className="text-sm text-muted-foreground">
                This may take a few moments...
              </p>
            </div>
          )}

          <div className="pt-4 border-t">
            <div className="text-center">
              <Link 
                to="/" 
                className="text-sm text-muted-foreground hover:text-primary transition-colors"
              >
                ← Back to Home
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}