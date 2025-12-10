'use client';

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import React from "react";
import { ArrowRight, Video, Clock } from "lucide-react";
import { useRouter } from "next/navigation";
import { useToast } from "@/hooks/use-toast";


export default function SchedulePage() {
    const [date, setDate] = React.useState<Date | undefined>(new Date());
    const [selectedTime, setSelectedTime] = React.useState<string | null>(null);
    const router = useRouter();
    const {toast} = useToast();

    const availableTimes = ["09:00", "10:00", "11:00", "14:00", "15:00", "16:00"];

    const handleConfirm = () => {
        toast({
            title: "Meeting Scheduled!",
            description: `Your meeting is confirmed for ${date?.toLocaleDateString()} at ${selectedTime}.`,
        });
        router.push("/dashboard/cases/123/messaging");
    }

    return (
        <div className="container mx-auto py-8">
            <Card className="max-w-4xl mx-auto">
                <CardHeader className="text-center">
                    <Video className="mx-auto h-12 w-12 text-primary" />
                    <CardTitle className="text-2xl mt-4">Schedule Kick-off Meeting</CardTitle>
                    <CardDescription>Select a time to meet with Dr. Evelyn Reed for the case "Contrefaçon Logiciel".</CardDescription>
                </CardHeader>
                <CardContent className="grid md:grid-cols-2 gap-8 items-start">
                    <div className="flex justify-center">
                        <Calendar
                            mode="single"
                            selected={date}
                            onSelect={setDate}
                            className="rounded-md border"
                        />
                    </div>
                    <div className="space-y-6">
                         <div>
                            <h3 className="font-semibold mb-4 flex items-center gap-2"><Clock className="w-5 h-5" /> Select a Time Slot</h3>
                            <div className="grid grid-cols-3 gap-2">
                                {availableTimes.map(time => (
                                    <Button 
                                        key={time} 
                                        variant={selectedTime === time ? 'default' : 'outline'}
                                        onClick={() => setSelectedTime(time)}
                                    >
                                        {time}
                                    </Button>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="participants">Invite Participants (Optional)</Label>
                            <Input id="participants" placeholder="colleague1@example.com, colleague2@example.com" />
                            <p className="text-xs text-muted-foreground">Separate multiple emails with a comma.</p>
                        </div>
                        
                         {selectedTime && (
                             <div className="p-4 bg-muted/50 rounded-lg space-y-4">
                                <h4 className="font-semibold">Meeting Summary</h4>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Date:</span>
                                    <Badge variant="secondary">{date?.toLocaleDateString()}</Badge>
                                </div>
                                <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Time:</span>
                                    <Badge variant="secondary">{selectedTime}</Badge>
                                </div>
                                 <div className="flex justify-between items-center">
                                    <span className="text-muted-foreground">Expert:</span>
                                    <span>Dr. Evelyn Reed</span>
                                </div>
                                <Button className="w-full" onClick={handleConfirm}>
                                    Confirm Meeting <ArrowRight className="ml-2 h-4 w-4"/>
                                </Button>
                             </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
