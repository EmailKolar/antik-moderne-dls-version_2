import { SignIn, SignUp } from "@clerk/react-router";

import { Tabs, TabsContent, TabsList, TabsTrigger } from "~/components/ui/tabs";
import type { Route } from "./+types/sign-in";

export function meta({}: Route.MetaArgs) {
  return [{ title: "Signin - Antik Moderne" }, { name: "description", content: "Signin" }];
}

export default function SignInPage() {
  return (
    <div className="flex flex-col items-center text-center">
      <h1 className="my-4 text-4xl font-bold mb-4">Sign in or up</h1>

      <Tabs defaultValue="signin" className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign in</TabsTrigger>
          <TabsTrigger value="signup">Create account</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <SignIn />
        </TabsContent>
        <TabsContent value="signup">
          <SignUp />
        </TabsContent>
      </Tabs>
    </div>
  );
}
