"use client";

import React from "react";
import { Code, FileCode, Database, GitBranch, Cloud, Shield } from "lucide-react";
import OnboardingFlow from "@/components/studios/OnboardingFlow";
import { OnboardingStep } from "@/components/studios/OnboardingFlow";

export const devStudioOnboardingSteps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to Dev Studio",
    content: (
      <div className="space-y-4">
        <p>
          Dev Studio is your workspace for building real software applications. Here, you can create projects, 
          design systems, and deploy them to the cloud.
        </p>
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <p className="text-sm font-semibold text-blue-900 mb-2">What you can do here:</p>
          <ul className="list-disc list-inside space-y-1 text-sm text-blue-800">
            <li>Create new software projects from templates</li>
            <li>Design APIs (Application Programming Interfaces) that let programs talk to each other</li>
            <li>Create database structures to store information</li>
            <li>Set up automated testing and deployment</li>
            <li>Deploy your applications to cloud platforms</li>
          </ul>
        </div>
        <p className="text-sm text-slate-600">
          <strong>Tip:</strong> If you are new to software development, start with the learning studio at 
          <code className="bg-slate-100 px-2 py-1 rounded">/dev-studios</code> to understand the concepts first.
        </p>
      </div>
    )
  },
  {
    id: "project-builder",
    title: "Project Builder",
    content: (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Code className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">What is Project Builder?</h4>
            <p className="text-sm text-slate-600">Creates the starting structure for your software project</p>
          </div>
        </div>
        <p>
          The Project Builder helps you create a new software project by setting up all the necessary files and 
          folders. Think of it like getting a new house with all the rooms already built, and you just need to 
          add your furniture (your code).
        </p>
        <div className="bg-slate-50 p-4 rounded-lg">
          <p className="text-sm font-semibold text-slate-900 mb-2">How it works:</p>
          <ol className="list-decimal list-inside space-y-1 text-sm text-slate-700">
            <li>Choose what type of project you want (website, mobile app, API, etc.)</li>
            <li>Select the programming languages and tools you want to use</li>
            <li>The builder creates all the starting files for you</li>
            <li>You can then start writing your code in these files</li>
          </ol>
        </div>
        <p className="text-sm text-slate-600">
          <strong>Example:</strong> If you want to build a website, the Project Builder creates files for 
          the homepage, styles, and configuration, so you do not have to create them from scratch.
        </p>
      </div>
    )
  },
  {
    id: "api-designer",
    title: "API Designer",
    content: (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <FileCode className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">What is an API?</h4>
            <p className="text-sm text-slate-600">API stands for Application Programming Interface</p>
          </div>
        </div>
        <p>
          An API is like a menu in a restaurant. The menu tells you what food is available and how to order it. 
          Similarly, an API tells other programs what information or actions are available and how to request them.
        </p>
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <p className="text-sm font-semibold text-blue-900 mb-2">Simple example:</p>
          <p className="text-sm text-blue-800 mb-2">
            Imagine you have a weather app on your phone. When you open it, the app asks a weather service 
            (through an API): "What is the weather in London?" The weather service responds: "It is sunny, 20 degrees."
          </p>
          <p className="text-sm text-blue-800">
            The API Designer helps you create these rules for how programs can ask your application questions 
            and get answers.
          </p>
        </div>
        <p>
          With the API Designer, you can:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
          <li>Define what questions (requests) your API can answer</li>
          <li>Specify what information (data) it will return</li>
          <li>Test your API to make sure it works correctly</li>
          <li>Generate documentation so others know how to use it</li>
        </ul>
      </div>
    )
  },
  {
    id: "schema-designer",
    title: "Database Schema Designer",
    content: (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-indigo-100 rounded-lg">
            <Database className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">What is a Database Schema?</h4>
            <p className="text-sm text-slate-600">A plan for how information is organised in a database</p>
          </div>
        </div>
        <p>
          A database is like a digital filing cabinet where you store information. A schema is like the labels 
          and folders you use to organise that information so you can find it easily.
        </p>
        <div className="bg-indigo-50 border border-indigo-200 p-4 rounded-lg">
          <p className="text-sm font-semibold text-indigo-900 mb-2">Real-world example:</p>
          <p className="text-sm text-indigo-800 mb-2">
            Imagine you run a library. You need to organise books so people can find them. You might create 
            sections like:
          </p>
          <ul className="list-disc list-inside text-sm text-indigo-800 space-y-1">
            <li>Fiction section (for story books)</li>
            <li>Non-fiction section (for fact books)</li>
            <li>Each book has: Title, Author, ISBN number, Location on shelf</li>
          </ul>
          <p className="text-sm text-indigo-800 mt-2">
            A database schema does the same thing for digital information. It defines what types of information 
            you store and how they relate to each other.
          </p>
        </div>
        <p>
          The Schema Designer helps you:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
          <li>Create tables (like sections in a library) to organise information</li>
          <li>Define fields (like Title, Author) for each type of information</li>
          <li>Set up relationships between different pieces of information</li>
          <li>Generate code to create the database structure</li>
        </ul>
      </div>
    )
  },
  {
    id: "cicd-builder",
    title: "CI/CD Pipeline Builder",
    content: (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-purple-100 rounded-lg">
            <GitBranch className="w-6 h-6 text-purple-600" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">What is CI/CD?</h4>
            <p className="text-sm text-slate-600">CI/CD stands for Continuous Integration and Continuous Deployment</p>
          </div>
        </div>
        <p>
          CI/CD is like having an assistant that automatically tests your code and puts it live on the internet 
          when you are ready. Instead of doing these steps manually every time, the computer does them for you.
        </p>
        <div className="bg-purple-50 border border-purple-200 p-4 rounded-lg">
          <p className="text-sm font-semibold text-purple-900 mb-2">How it works (simple explanation):</p>
          <ol className="list-decimal list-inside text-sm text-purple-800 space-y-2">
            <li>
              <strong>You write code</strong> - Like writing a story or solving a maths problem
            </li>
            <li>
              <strong>You save it</strong> - The computer automatically checks if your code works (testing)
            </li>
            <li>
              <strong>If it works</strong> - The computer automatically puts it on the internet (deployment)
            </li>
            <li>
              <strong>If it does not work</strong> - The computer tells you what is wrong so you can fix it
            </li>
          </ol>
        </div>
        <p>
          The CI/CD Builder helps you create these automated workflows so you do not have to manually test and 
          deploy your code every time you make changes.
        </p>
      </div>
    )
  },
  {
    id: "deployment",
    title: "Deployment Wizard",
    content: (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-emerald-100 rounded-lg">
            <Cloud className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">What is Deployment?</h4>
            <p className="text-sm text-slate-600">Putting your application on the internet so others can use it</p>
          </div>
        </div>
        <p>
          Deployment is like publishing a book. You write it (create your application), and then you publish it 
          (deploy it) so other people can read it (use your application).
        </p>
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
          <p className="text-sm font-semibold text-emerald-900 mb-2">What happens during deployment:</p>
          <ol className="list-decimal list-inside text-sm text-emerald-800 space-y-1">
            <li>Your code is copied to a computer that is always connected to the internet (a server)</li>
            <li>The server is configured to run your application</li>
            <li>Your application gets a web address (URL) so people can access it</li>
            <li>Your application is now live and available to users</li>
          </ol>
        </div>
        <p>
          The Deployment Wizard guides you through deploying to platforms like:
        </p>
        <ul className="list-disc list-inside space-y-1 text-sm text-slate-700">
          <li><strong>Vercel:</strong> Great for websites and web applications</li>
          <li><strong>AWS (Amazon Web Services):</strong> Powerful cloud platform for all types of applications</li>
          <li><strong>Google Cloud Platform:</strong> Another major cloud provider</li>
          <li><strong>Microsoft Azure:</strong> Microsoft's cloud platform</li>
        </ul>
      </div>
    )
  },
  {
    id: "security",
    title: "Security Scanner",
    content: (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-rose-100 rounded-lg">
            <Shield className="w-6 h-6 text-rose-600" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">What is Security Scanning?</h4>
            <p className="text-sm text-slate-600">Checking your code for security problems</p>
          </div>
        </div>
        <p>
          Security scanning is like having a security guard check your house for unlocked doors or windows. 
          It looks through your code to find potential security problems before bad actors can exploit them.
        </p>
        <div className="bg-rose-50 border border-rose-200 p-4 rounded-lg">
          <p className="text-sm font-semibold text-rose-900 mb-2">What the scanner looks for:</p>
          <ul className="list-disc list-inside text-sm text-rose-800 space-y-1">
            <li>Weak passwords or authentication</li>
            <li>Code that could be exploited by hackers</li>
            <li>Missing security updates</li>
            <li>Information that should be kept secret but is exposed</li>
            <li>Ways attackers could break into your application</li>
          </ul>
        </div>
        <p>
          The Security Scanner automatically checks your code and creates a report showing any security issues 
          it finds, along with suggestions on how to fix them.
        </p>
      </div>
    )
  },
  {
    id: "ready",
    title: "You are Ready to Start",
    content: (
      <div className="space-y-4">
        <div className="bg-green-50 border border-green-200 p-6 rounded-lg text-center">
          <p className="text-lg font-semibold text-green-900 mb-2">
            You now understand the main tools in Dev Studio
          </p>
          <p className="text-sm text-green-800">
            Remember: you can always click the help icon (?) next to any feature to learn more about it.
          </p>
        </div>
        <div className="space-y-3">
          <p><strong>Next steps:</strong></p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700">
            <li>Start with the Project Builder to create your first project</li>
            <li>Use the API Designer if you need to create an API</li>
            <li>Design your database structure with the Schema Designer</li>
            <li>Set up automated testing and deployment with CI/CD Builder</li>
            <li>Deploy your application using the Deployment Wizard</li>
            <li>Run security scans regularly to keep your application safe</li>
          </ol>
        </div>
        <p className="text-sm text-slate-600">
          <strong>Tip:</strong> Start small. Create a simple project first, then gradually add more features 
          as you become more comfortable with the tools.
        </p>
      </div>
    )
  }
];



