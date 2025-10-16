import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Settings as SettingsIcon, 
  Users, 
  Shield, 
  Palette, 
  CreditCard, 
  Bell,
  Key,
  Save
} from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";

const organizationSchema = z.object({
  name: z.string().min(1, "Organization name is required"),
  domain: z.string().min(1, "Domain is required"),
  description: z.string().optional(),
  website: z.string().url().optional().or(z.literal("")),
  industry: z.string().optional(),
});

const securitySchema = z.object({
  sso_enabled: z.boolean(),
  sso_provider: z.string().optional(),
  password_min_length: z.number().min(6).max(50),
  password_require_uppercase: z.boolean(),
  password_require_lowercase: z.boolean(),
  password_require_numbers: z.boolean(),
  password_require_symbols: z.boolean(),
  password_max_age_days: z.number().min(30).max(365).optional(),
  two_factor_enabled: z.boolean(),
});

const brandingSchema = z.object({
  logo_url: z.string().url().optional().or(z.literal("")),
  primary_color: z.string().optional(),
  secondary_color: z.string().optional(),
  custom_css: z.string().optional(),
});

const billingSchema = z.object({
  plan_name: z.string(),
  seat_count: z.number(),
  seats_used: z.number(),
  next_billing_date: z.string(),
  payment_method: z.string(),
});

type BillingData = z.infer<typeof billingSchema>;

type OrganizationForm = z.infer<typeof organizationSchema>;
type SecurityForm = z.infer<typeof securitySchema>;
type BrandingForm = z.infer<typeof brandingSchema>;

export default function SettingsPage() {
  const [activeTab, setActiveTab] = useState("organization");
  const [isLoading, setIsLoading] = useState(false);
  // const [showPassword, setShowPassword] = useState(false);

  const organizationForm = useForm<OrganizationForm>({
    resolver: zodResolver(organizationSchema),
    defaultValues: {
      name: "TechCorp Manufacturing",
      domain: "techcorp.com",
      description: "Leading manufacturer of industrial equipment",
      website: "https://techcorp.com",
      industry: "Manufacturing"
    }
  });

  const securityForm = useForm<SecurityForm>({
    resolver: zodResolver(securitySchema),
    defaultValues: {
      sso_enabled: false,
      sso_provider: "",
      password_min_length: 8,
      password_require_uppercase: true,
      password_require_lowercase: true,
      password_require_numbers: true,
      password_require_symbols: true,
      password_max_age_days: 90,
      two_factor_enabled: true
    }
  });

  const brandingForm = useForm<BrandingForm>({
    resolver: zodResolver(brandingSchema),
    defaultValues: {
      logo_url: "",
      primary_color: "#0B5FFF",
      secondary_color: "#00A676",
      custom_css: ""
    }
  });

  const mockBillingData: BillingData = {
    plan_name: "Professional",
    seat_count: 50,
    seats_used: 34,
    next_billing_date: "2024-02-15",
    payment_method: "**** **** **** 1234"
  };

  const handleOrganizationSubmit = async (_data: OrganizationForm) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const handleSecuritySubmit = async (_data: SecurityForm) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  const handleBrandingSubmit = async (_data: BrandingForm) => {
    setIsLoading(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000));
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen bg-gradient-mesh p-4">
      <div className="container mx-auto max-w-6xl">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground mb-2">Settings</h1>
              <p className="text-muted-foreground">
                Manage your organization's settings and preferences
              </p>
            </div>
            <div className="flex items-center space-x-2">
              <Badge variant="outline">Admin Access</Badge>
            </div>
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="organization" className="flex items-center space-x-2">
              <Users className="h-4 w-4" />
              <span className="hidden sm:inline">Organization</span>
            </TabsTrigger>
            <TabsTrigger value="security" className="flex items-center space-x-2">
              <Shield className="h-4 w-4" />
              <span className="hidden sm:inline">Security</span>
            </TabsTrigger>
            <TabsTrigger value="branding" className="flex items-center space-x-2">
              <Palette className="h-4 w-4" />
              <span className="hidden sm:inline">Branding</span>
            </TabsTrigger>
            <TabsTrigger value="billing" className="flex items-center space-x-2">
              <CreditCard className="h-4 w-4" />
              <span className="hidden sm:inline">Billing</span>
            </TabsTrigger>
            <TabsTrigger value="notifications" className="flex items-center space-x-2">
              <Bell className="h-4 w-4" />
              <span className="hidden sm:inline">Notifications</span>
            </TabsTrigger>
          </TabsList>

          {/* Organization Settings */}
          <TabsContent value="organization">
            <Card className="animate-fade-in-up">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Users className="h-5 w-5" />
                  <span>Organization Information</span>
                </CardTitle>
                <CardDescription>
                  Manage your organization's basic information and settings
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={organizationForm.handleSubmit(handleOrganizationSubmit)} className="space-y-6">
                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="name">Organization Name</Label>
                      <Input
                        id="name"
                        {...organizationForm.register('name')}
                        className="input-focus"
                      />
                      {organizationForm.formState.errors.name && (
                        <p className="text-sm text-destructive">
                          {organizationForm.formState.errors.name.message}
                        </p>
                      )}
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="domain">Domain</Label>
                      <Input
                        id="domain"
                        {...organizationForm.register('domain')}
                        className="input-focus"
                      />
                      {organizationForm.formState.errors.domain && (
                        <p className="text-sm text-destructive">
                          {organizationForm.formState.errors.domain.message}
                        </p>
                      )}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="description">Description</Label>
                    <Textarea
                      id="description"
                      {...organizationForm.register('description')}
                      className="input-focus"
                      rows={3}
                    />
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="website">Website</Label>
                      <Input
                        id="website"
                        type="url"
                        {...organizationForm.register('website')}
                        className="input-focus"
                        placeholder="https://example.com"
                      />
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="industry">Industry</Label>
                      <Input
                        id="industry"
                        {...organizationForm.register('industry')}
                        className="input-focus"
                      />
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <SettingsIcon className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Settings */}
          <TabsContent value="security">
            <div className="space-y-6">
              <Card className="animate-fade-in-up">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Shield className="h-5 w-5" />
                    <span>Single Sign-On (SSO)</span>
                  </CardTitle>
                  <CardDescription>
                    Configure enterprise SSO integration
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={securityForm.handleSubmit(handleSecuritySubmit)} className="space-y-6">
                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="sso_enabled">Enable SSO</Label>
                        <p className="text-sm text-muted-foreground">
                          Allow users to sign in with your organization's SSO provider
                        </p>
                      </div>
                      <Switch
                        id="sso_enabled"
                        checked={securityForm.watch('sso_enabled')}
                        onCheckedChange={(checked: boolean) => securityForm.setValue('sso_enabled', checked)}
                      />
                    </div>

                    {securityForm.watch('sso_enabled') && (
                      <div className="space-y-4 p-4 border rounded-lg bg-muted/50">
                        <div className="space-y-2">
                          <Label htmlFor="sso_provider">SSO Provider</Label>
                          <Input
                            id="sso_provider"
                            {...securityForm.register('sso_provider')}
                            className="input-focus"
                            placeholder="e.g., Azure AD, Okta, Google Workspace"
                          />
                        </div>
                        <div className="text-sm text-muted-foreground">
                          <p>To complete SSO setup, you'll need to:</p>
                          <ul className="list-disc list-inside mt-2 space-y-1">
                            <li>Configure your identity provider</li>
                            <li>Upload SAML metadata</li>
                            <li>Test the connection</li>
                          </ul>
                        </div>
                      </div>
                    )}

                    <div className="flex justify-end">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <SettingsIcon className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>

              <Card className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <Key className="h-5 w-5" />
                    <span>Password Policy</span>
                  </CardTitle>
                  <CardDescription>
                    Configure password requirements for your organization
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <form onSubmit={securityForm.handleSubmit(handleSecuritySubmit)} className="space-y-6">
                    <div className="space-y-2">
                      <Label htmlFor="password_min_length">Minimum Password Length</Label>
                      <Input
                        id="password_min_length"
                        type="number"
                        {...securityForm.register('password_min_length', { valueAsNumber: true })}
                        className="input-focus"
                        min="6"
                        max="50"
                      />
                    </div>

                    <div className="space-y-4">
                      <h4 className="font-medium">Password Requirements</h4>
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password_require_uppercase">Require uppercase letters</Label>
                          <Switch
                            id="password_require_uppercase"
                            checked={securityForm.watch('password_require_uppercase')}
                            onCheckedChange={(checked: boolean) => securityForm.setValue('password_require_uppercase', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password_require_lowercase">Require lowercase letters</Label>
                          <Switch
                            id="password_require_lowercase"
                            checked={securityForm.watch('password_require_lowercase')}
                            onCheckedChange={(checked: boolean) => securityForm.setValue('password_require_lowercase', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password_require_numbers">Require numbers</Label>
                          <Switch
                            id="password_require_numbers"
                            checked={securityForm.watch('password_require_numbers')}
                            onCheckedChange={(checked: boolean) => securityForm.setValue('password_require_numbers', checked)}
                          />
                        </div>
                        <div className="flex items-center justify-between">
                          <Label htmlFor="password_require_symbols">Require symbols</Label>
                          <Switch
                            id="password_require_symbols"
                            checked={securityForm.watch('password_require_symbols')}
                            onCheckedChange={(checked: boolean) => securityForm.setValue('password_require_symbols', checked)}
                          />
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="password_max_age_days">Password Expiry (days)</Label>
                      <Input
                        id="password_max_age_days"
                        type="number"
                        {...securityForm.register('password_max_age_days', { valueAsNumber: true })}
                        className="input-focus"
                        min="30"
                        max="365"
                      />
                      <p className="text-sm text-muted-foreground">
                        Leave empty to disable password expiry
                      </p>
                    </div>

                    <div className="flex items-center justify-between">
                      <div>
                        <Label htmlFor="two_factor_enabled">Two-Factor Authentication</Label>
                        <p className="text-sm text-muted-foreground">
                          Require 2FA for all users
                        </p>
                      </div>
                      <Switch
                        id="two_factor_enabled"
                        checked={securityForm.watch('two_factor_enabled')}
                        onCheckedChange={(checked: boolean) => securityForm.setValue('two_factor_enabled', checked)}
                      />
                    </div>

                    <div className="flex justify-end">
                      <Button type="submit" disabled={isLoading}>
                        {isLoading ? (
                          <>
                            <SettingsIcon className="mr-2 h-4 w-4 animate-spin" />
                            Saving...
                          </>
                        ) : (
                          <>
                            <Save className="mr-2 h-4 w-4" />
                            Save Changes
                          </>
                        )}
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Branding Settings */}
          <TabsContent value="branding">
            <Card className="animate-fade-in-up">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Palette className="h-5 w-5" />
                  <span>Branding & Appearance</span>
                </CardTitle>
                <CardDescription>
                  Customize the appearance of your training platform
                </CardDescription>
              </CardHeader>
              <CardContent>
                <form onSubmit={brandingForm.handleSubmit(handleBrandingSubmit)} className="space-y-6">
                  <div className="space-y-2">
                    <Label htmlFor="logo_url">Logo URL</Label>
                    <Input
                      id="logo_url"
                      type="url"
                      {...brandingForm.register('logo_url')}
                      className="input-focus"
                      placeholder="https://example.com/logo.png"
                    />
                    <p className="text-sm text-muted-foreground">
                      Upload your organization's logo (recommended size: 200x60px)
                    </p>
                  </div>

                  <div className="grid md:grid-cols-2 gap-6">
                    <div className="space-y-2">
                      <Label htmlFor="primary_color">Primary Color</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="primary_color"
                          {...brandingForm.register('primary_color')}
                          className="input-focus"
                          placeholder="#0B5FFF"
                        />
                        <div 
                          className="w-10 h-10 rounded border"
                          style={{ backgroundColor: brandingForm.watch('primary_color') || '#0B5FFF' }}
                        />
                      </div>
                    </div>

                    <div className="space-y-2">
                      <Label htmlFor="secondary_color">Secondary Color</Label>
                      <div className="flex items-center space-x-2">
                        <Input
                          id="secondary_color"
                          {...brandingForm.register('secondary_color')}
                          className="input-focus"
                          placeholder="#00A676"
                        />
                        <div 
                          className="w-10 h-10 rounded border"
                          style={{ backgroundColor: brandingForm.watch('secondary_color') || '#00A676' }}
                        />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="custom_css">Custom CSS</Label>
                    <Textarea
                      id="custom_css"
                      {...brandingForm.register('custom_css')}
                      className="input-focus font-mono text-sm"
                      rows={8}
                      placeholder="/* Add your custom CSS here */"
                    />
                    <p className="text-sm text-muted-foreground">
                      Add custom CSS to further customize the appearance
                    </p>
                  </div>

                  <div className="flex justify-end">
                    <Button type="submit" disabled={isLoading}>
                      {isLoading ? (
                        <>
                          <SettingsIcon className="mr-2 h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="mr-2 h-4 w-4" />
                          Save Changes
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Billing Settings */}
          <TabsContent value="billing">
            <div className="space-y-6">
              <Card className="animate-fade-in-up">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-2">
                    <CreditCard className="h-5 w-5" />
                    <span>Current Plan</span>
                  </CardTitle>
                  <CardDescription>
                    Your current subscription and billing information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="grid md:grid-cols-3 gap-6">
                    <div className="space-y-2">
                      <Label>Plan</Label>
                      <div className="text-2xl font-bold">{mockBillingData.plan_name}</div>
                    </div>
                    <div className="space-y-2">
                      <Label>Seats</Label>
                      <div className="text-2xl font-bold">
                        {mockBillingData.seats_used} / {mockBillingData.seat_count}
                      </div>
                      <div className="w-full bg-muted rounded-full h-2">
                        <div 
                          className="bg-primary h-2 rounded-full" 
                          style={{ width: `${(mockBillingData.seats_used / mockBillingData.seat_count) * 100}%` }}
                        />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label>Next Billing</Label>
                      <div className="text-2xl font-bold">
                        {new Date(mockBillingData.next_billing_date).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 flex space-x-4">
                    <Button>
                      Upgrade Plan
                    </Button>
                    <Button variant="outline">
                      Manage Billing
                    </Button>
                  </div>
                </CardContent>
              </Card>

              <Card className="animate-fade-in-up" style={{ animationDelay: '0.1s' }}>
                <CardHeader>
                  <CardTitle>Payment Method</CardTitle>
                  <CardDescription>
                    Manage your payment information
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-3">
                      <CreditCard className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">Visa ending in 1234</p>
                        <p className="text-sm text-muted-foreground">Expires 12/25</p>
                      </div>
                    </div>
                    <Button variant="outline">
                      Update
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Notification Settings */}
          <TabsContent value="notifications">
            <Card className="animate-fade-in-up">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2">
                  <Bell className="h-5 w-5" />
                  <span>Notification Preferences</span>
                </CardTitle>
                <CardDescription>
                  Configure how you receive notifications
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-6">
                  <div className="space-y-4">
                    <h4 className="font-medium">Email Notifications</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Course Assignments</Label>
                          <p className="text-sm text-muted-foreground">
                            Get notified when you're assigned to a new course
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Certificate Issued</Label>
                          <p className="text-sm text-muted-foreground">
                            Get notified when you earn a new certificate
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>System Updates</Label>
                          <p className="text-sm text-muted-foreground">
                            Get notified about platform updates and maintenance
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <h4 className="font-medium">In-App Notifications</h4>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Real-time Updates</Label>
                          <p className="text-sm text-muted-foreground">
                            Show notifications in the application
                          </p>
                        </div>
                        <Switch defaultChecked />
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <Label>Sound Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Play sound for new notifications
                          </p>
                        </div>
                        <Switch />
                      </div>
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button>
                      <Save className="mr-2 h-4 w-4" />
                      Save Preferences
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}