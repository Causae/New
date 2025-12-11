import {
  Paperclip,
  Send,
} from 'lucide-react';

import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

export default function MessagingPage() {
  return (
    <div className="container mx-auto py-8">
      <div className="grid lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2">
            <Card>
                <CardHeader>
                    <CardTitle>Case Chat: Contrefaçon Logiciel</CardTitle>
                    <CardDescription>Conversation with Dr. Evelyn Reed</CardDescription>
                </CardHeader>
                <CardContent className="h-[500px] overflow-y-auto space-y-6 p-6">
                    <div className="flex items-start gap-4">
                        <Avatar>
                            <AvatarImage src="https://picsum.photos/seed/lawyer/40/40" />
                            <AvatarFallback>AV</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1">
                            <div className="bg-muted rounded-lg p-3 max-w-lg">
                                <p className="text-sm">Bonjour Dr. Reed, merci d'avoir accepté ce cas. Pourriez-vous me donner une première estimation du temps nécessaire pour l'analyse préliminaire ?</p>
                            </div>
                            <p className="text-xs text-muted-foreground">Alicia Vexin • 2 hours ago</p>
                        </div>
                    </div>
                    <div className="flex items-start gap-4 flex-row-reverse">
                        <Avatar>
                            <AvatarImage src="https://picsum.photos/seed/expert1/40/40" />
                            <AvatarFallback>ER</AvatarFallback>
                        </Avatar>
                        <div className="space-y-1 text-right">
                             <div className="bg-primary/20 rounded-lg p-3 max-w-lg inline-block text-left">
                                <p className="text-sm">Bonjour Maître Vexin. Bien sûr. Après une première lecture des documents, j'estime qu'il me faudra environ 5 heures. Je vous soumets une proposition de devis dans la journée.</p>
                            </div>
                            <p className="text-xs text-muted-foreground">Dr. Evelyn Reed • 1 hour ago</p>
                        </div>
                    </div>
                </CardContent>
                <CardFooter className="border-t pt-4">
                    <div className="relative w-full">
                        <Textarea placeholder="Type your message here..." className="pr-20" />
                        <div className="absolute right-2 top-1/2 -translate-y-1/2 flex items-center gap-1">
                            <Button variant="ghost" size="icon">
                                <Paperclip className="h-5 w-5" />
                            </Button>
                            <Button size="icon">
                                <Send className="h-5 w-5" />
                            </Button>
                        </div>
                    </div>
                </CardFooter>
            </Card>
        </div>
        <div className="space-y-8">
            <Card>
                <CardHeader>
                    <CardTitle>Expert Quote</CardTitle>
                    <CardDescription>Submit your quote for this case.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Estimated Hours</label>
                        <Input type="number" placeholder="e.g., 10" />
                    </div>
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Hourly Rate (€)</label>
                        <Input type="number" placeholder="e.g., 250" />
                    </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium">Quote Details</label>
                        <Textarea placeholder="Detail the tasks included in this quote..." />
                    </div>
                </CardContent>
                <CardFooter>
                    <Button className="w-full">Submit Quote</Button>
                </CardFooter>
            </Card>
        </div>
      </div>
    </div>
  );
}
