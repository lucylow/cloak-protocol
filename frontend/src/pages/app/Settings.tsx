import { Settings as SettingsIcon, Shield, Bell, Palette, Globe } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Button } from '@/components/ui/button';

const SettingsPage = () => {
  return (
    <div className="max-w-3xl mx-auto space-y-8">
      <div className="flex items-center gap-4">
        <div className="h-14 w-14 bg-gradient-primary rounded-xl flex items-center justify-center">
          <SettingsIcon className="h-7 w-7 text-primary-foreground" />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-foreground">Settings</h1>
          <p className="text-muted-foreground">Manage your preferences</p>
        </div>
      </div>

      {/* Privacy Settings */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Shield className="h-5 w-5 text-accent" />
            <div>
              <CardTitle>Privacy Settings</CardTitle>
              <CardDescription>Configure your privacy preferences</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Auto-generate proofs</Label>
              <p className="text-sm text-muted-foreground">Automatically generate ZK proofs for all trades</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Enhanced privacy mode</Label>
              <p className="text-sm text-muted-foreground">Use additional mixing for maximum anonymity</p>
            </div>
            <Switch />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Proof caching</Label>
              <p className="text-sm text-muted-foreground">Cache proofs locally for faster transactions</p>
            </div>
            <Switch defaultChecked />
          </div>
        </CardContent>
      </Card>

      {/* Notifications */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Bell className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle>Notifications</CardTitle>
              <CardDescription>Configure alert preferences</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Trade confirmations</Label>
              <p className="text-sm text-muted-foreground">Get notified when trades are settled</p>
            </div>
            <Switch defaultChecked />
          </div>
          <div className="flex items-center justify-between">
            <div>
              <Label>Price alerts</Label>
              <p className="text-sm text-muted-foreground">Receive alerts for price movements</p>
            </div>
            <Switch />
          </div>
        </CardContent>
      </Card>

      {/* Appearance */}
      <Card className="bg-card border-border">
        <CardHeader>
          <div className="flex items-center gap-3">
            <Palette className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle>Appearance</CardTitle>
              <CardDescription>Customize the interface</CardDescription>
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="flex items-center justify-between">
            <div>
              <Label>Theme</Label>
              <p className="text-sm text-muted-foreground">Choose your preferred theme</p>
            </div>
            <Select defaultValue="dark">
              <SelectTrigger className="w-32">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="dark">Dark</SelectItem>
                <SelectItem value="light">Light</SelectItem>
                <SelectItem value="system">System</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button className="bg-gradient-primary text-primary-foreground">
          Save Changes
        </Button>
      </div>
    </div>
  );
};

export default SettingsPage;
