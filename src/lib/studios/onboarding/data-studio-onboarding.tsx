"use client";

import React from "react";
import { Database, GitBranch, Eye, BarChart3, Shield, Network, Layers, FileText } from "lucide-react";
import { OnboardingStep } from "@/components/studios/OnboardingFlow";

export const dataStudioOnboardingSteps: OnboardingStep[] = [
  {
    id: "welcome",
    title: "Welcome to Data Studio",
    content: (
      <div className="space-y-4">
        <p>
          Data Studio is your workspace for building data pipelines, monitoring data quality, and ensuring 
          data governance. Here, you can design pipelines, build catalogs, create dashboards, and ensure 
          your data meets privacy and compliance requirements.
        </p>
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
          <p className="text-sm font-semibold text-amber-900 mb-2">What you can do here:</p>
          <ul className="list-disc list-inside space-y-1 text-sm text-amber-800">
            <li>Create data processing workflows (pipelines)</li>
            <li>Monitor data quality automatically</li>
            <li>Organise information about your data (catalogs)</li>
            <li>Create visual dashboards with charts and graphs</li>
            <li>Check data privacy compliance</li>
            <li>Track where data comes from and goes (lineage)</li>
          </ul>
        </div>
        <p className="text-sm text-slate-600">
          <strong>Tip:</strong> If you are new to data engineering, start with the learning studio at 
          <code className="bg-slate-100 px-2 py-1 rounded">/data-studios</code> to understand the concepts first.
        </p>
      </div>
    )
  },
  {
    id: "pipeline-designer",
    title: "Data Pipeline Designer",
    content: (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-amber-100 rounded-lg">
            <GitBranch className="w-6 h-6 text-amber-600" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">What is a Data Pipeline?</h4>
            <p className="text-sm text-slate-600">A workflow that processes data step by step</p>
          </div>
        </div>
        <p>
          A data pipeline is like a factory assembly line where data moves through different stages. Each stage 
          does a specific job, like cleaning data, transforming it, or loading it into a database.
        </p>
        <div className="bg-amber-50 border border-amber-200 p-4 rounded-lg">
          <p className="text-sm font-semibold text-amber-900 mb-2">How it works:</p>
          <ol className="list-decimal list-inside space-y-1 text-sm text-amber-800">
            <li>Design the steps your data needs to go through</li>
            <li>Connect the steps in order</li>
            <li>Test the pipeline with sample data</li>
            <li>Run the pipeline to process your data</li>
          </ol>
        </div>
        <p className="text-sm text-slate-600">
          <strong>Example:</strong> Create a pipeline that reads customer data from a CSV file, cleans it 
          (removes duplicates), and loads it into a database.
        </p>
      </div>
    )
  },
  {
    id: "quality-monitor",
    title: "Data Quality Monitor",
    content: (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-emerald-100 rounded-lg">
            <Eye className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">What is Data Quality?</h4>
            <p className="text-sm text-slate-600">How good and accurate your data is</p>
          </div>
        </div>
        <p>
          Data quality monitoring automatically checks your data for problems like missing values, duplicates, 
          or incorrect formats. It alerts you when problems are found so you can fix them.
        </p>
        <div className="bg-emerald-50 border border-emerald-200 p-4 rounded-lg">
          <p className="text-sm font-semibold text-emerald-900 mb-2">How it works:</p>
          <ol className="list-decimal list-inside space-y-1 text-sm text-emerald-800">
            <li>Set up quality checks for your data</li>
            <li>The monitor runs checks automatically</li>
            <li>Review alerts when problems are found</li>
            <li>Fix problems and verify the fixes</li>
          </ol>
        </div>
        <p className="text-sm text-slate-600">
          <strong>Example:</strong> Set up a check to find missing email addresses in customer data. 
          The monitor alerts you when missing emails are found.
        </p>
      </div>
    )
  },
  {
    id: "catalog-builder",
    title: "Data Catalog Builder",
    content: (
      <div className="space-y-4">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-3 bg-blue-100 rounded-lg">
            <Database className="w-6 h-6 text-blue-600" />
          </div>
          <div>
            <h4 className="font-semibold text-slate-900">What is a Data Catalog?</h4>
            <p className="text-sm text-slate-600">A library index that organises information about your data</p>
          </div>
        </div>
        <p>
          A data catalog is like a library index that helps you find and understand books. It organises 
          information about your data so you can find and use it easily.
        </p>
        <div className="bg-blue-50 border border-blue-200 p-4 rounded-lg">
          <p className="text-sm font-semibold text-blue-900 mb-2">How it works:</p>
          <ol className="list-decimal list-inside space-y-1 text-sm text-blue-800">
            <li>Add information about your datasets</li>
            <li>Organise datasets into categories</li>
            <li>Add descriptions and tags</li>
            <li>Search and browse the catalog</li>
          </ol>
        </div>
        <p className="text-sm text-slate-600">
          <strong>Example:</strong> Add a dataset called &quot;Customer Orders&quot; with a description, tags like{" "}
          &quot;sales&quot; and &quot;customer&quot;, and information about when it was last updated.
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
            You now understand the main tools in Data Studio
          </p>
          <p className="text-sm text-green-800">
            Remember: you can always click the help icon (?) next to any feature to learn more about it.
          </p>
        </div>
        <div className="space-y-3">
          <p><strong>Next steps:</strong></p>
          <ol className="list-decimal list-inside space-y-2 text-sm text-slate-700">
            <li>Start with the Pipeline Designer to create a data processing workflow</li>
            <li>Use the Quality Monitor to check if your data has any problems</li>
            <li>Use the Catalog Builder to organise information about your datasets</li>
            <li>Create dashboards to visualise your data</li>
            <li>Check privacy compliance with the Privacy Assessor</li>
            <li>Track data lineage to understand where data comes from</li>
          </ol>
        </div>
        <p className="text-sm text-slate-600">
          <strong>Tip:</strong> Start small. Create a simple pipeline first, then gradually add more steps 
          as you become more comfortable with the tools.
        </p>
      </div>
    )
  }
];



