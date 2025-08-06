"use client";

import { Button } from "~/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
  CardAction,
} from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";
import { Separator } from "~/components/ui/separator";
import { Skeleton } from "~/components/ui/skeleton";
import { Spinner } from "~/components/ui/spinner";
import { useState } from "react";

export default function UIShowcase() {
  const [inputValue, setInputValue] = useState("");
  const [textareaValue, setTextareaValue] = useState("");

  return (
    <div className="container mx-auto p-8 space-y-12">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold">UI Components Showcase</h1>
        <p className="text-muted-foreground text-lg">
          A collection of all UI components used in mito
        </p>
      </div>

      <Separator />

      {/* Button Components */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Buttons</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Button Variants</CardTitle>
              <CardDescription>
                Different button styles and variants
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap gap-2">
                <Button variant="default">Default</Button>
                <Button variant="secondary">Secondary</Button>
                <Button variant="destructive">Destructive</Button>
                <Button variant="outline">Outline</Button>
                <Button variant="ghost">Ghost</Button>
                <Button variant="link">Link</Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Button Sizes</CardTitle>
              <CardDescription>Different button sizes</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex flex-wrap items-center gap-2">
                <Button size="sm">Small</Button>
                <Button size="default">Default</Button>
                <Button size="lg">Large</Button>
                <Button size="icon">🎨</Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Form Components */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Form Components</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Input Fields</CardTitle>
              <CardDescription>Various input field examples</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="input-text">Text Input</Label>
                <Input
                  id="input-text"
                  type="text"
                  placeholder="Enter some text..."
                  value={inputValue}
                  onChange={(e) => setInputValue(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="input-email">Email Input</Label>
                <Input
                  id="input-email"
                  type="email"
                  placeholder="your@email.com"
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="input-password">Password Input</Label>
                <Input
                  id="input-password"
                  type="password"
                  placeholder="Enter password..."
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="input-disabled">Disabled Input</Label>
                <Input
                  id="input-disabled"
                  type="text"
                  placeholder="This is disabled"
                  disabled
                />
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Textarea</CardTitle>
              <CardDescription>Multi-line text input component</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="textarea-default">Default Textarea</Label>
                <Textarea
                  id="textarea-default"
                  placeholder="Enter your message here..."
                  value={textareaValue}
                  onChange={(e) => setTextareaValue(e.target.value)}
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="textarea-disabled">Disabled Textarea</Label>
                <Textarea
                  id="textarea-disabled"
                  placeholder="This textarea is disabled"
                  disabled
                />
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Card Components */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Cards</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Simple Card</CardTitle>
              <CardDescription>
                A basic card with title and description
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>
                This is the card content area where you can put any content you
                want.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Card with Action</CardTitle>
              <CardDescription>Card with an action button</CardDescription>
              <CardAction>
                <Button size="sm" variant="outline">
                  Action
                </Button>
              </CardAction>
            </CardHeader>
            <CardContent>
              <p>This card has an action button in the header area.</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Card with Footer</CardTitle>
              <CardDescription>
                Card that includes a footer section
              </CardDescription>
            </CardHeader>
            <CardContent>
              <p>This card demonstrates the footer component.</p>
            </CardContent>
            <CardFooter>
              <Button size="sm">Save</Button>
              <Button size="sm" variant="outline">
                Cancel
              </Button>
            </CardFooter>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Loading States */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Loading States</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <Card>
            <CardHeader>
              <CardTitle>Spinner</CardTitle>
              <CardDescription>Loading spinner component</CardDescription>
            </CardHeader>
            <CardContent className="flex items-center justify-center space-x-4 py-8">
              <Spinner />
              <div className="space-y-2">
                <Button disabled>
                  <Spinner className="mr-2 h-4 w-4" />
                  Loading...
                </Button>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Skeleton</CardTitle>
              <CardDescription>Skeleton loading placeholders</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Skeleton className="h-4 w-[250px]" />
                <Skeleton className="h-4 w-[200px]" />
                <Skeleton className="h-4 w-[150px]" />
              </div>
              <div className="flex items-center space-x-4">
                <Skeleton className="h-12 w-12 rounded-full" />
                <div className="space-y-2">
                  <Skeleton className="h-4 w-[120px]" />
                  <Skeleton className="h-4 w-[80px]" />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </section>

      <Separator />

      {/* Layout Components */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Layout Components</h2>
        <Card>
          <CardHeader>
            <CardTitle>Separator</CardTitle>
            <CardDescription>
              Horizontal and vertical separators
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Horizontal Separator:
              </p>
              <div className="space-y-2">
                <p>Content above separator</p>
                <Separator />
                <p>Content below separator</p>
              </div>
            </div>
            <div>
              <p className="text-sm text-muted-foreground mb-2">
                Vertical Separator:
              </p>
              <div className="flex items-center space-x-4">
                <span>Left content</span>
                <Separator orientation="vertical" className="h-6" />
                <span>Right content</span>
              </div>
            </div>
          </CardContent>
        </Card>
      </section>

      {/* Interactive Examples */}
      <section className="space-y-6">
        <h2 className="text-2xl font-semibold">Interactive Example</h2>
        <Card>
          <CardHeader>
            <CardTitle>Contact Form</CardTitle>
            <CardDescription>
              A complete form using multiple components
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="contact-name">Name</Label>
                <Input id="contact-name" placeholder="Your name" />
              </div>
              <div className="space-y-2">
                <Label htmlFor="contact-email">Email</Label>
                <Input
                  id="contact-email"
                  type="email"
                  placeholder="your@email.com"
                />
              </div>
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-subject">Subject</Label>
              <Input id="contact-subject" placeholder="What's this about?" />
            </div>
            <div className="space-y-2">
              <Label htmlFor="contact-message">Message</Label>
              <Textarea
                id="contact-message"
                placeholder="Your message here..."
                rows={4}
              />
            </div>
          </CardContent>
          <CardFooter>
            <Button>Send Message</Button>
            <Button variant="outline">Clear Form</Button>
          </CardFooter>
        </Card>
      </section>
    </div>
  );
}
