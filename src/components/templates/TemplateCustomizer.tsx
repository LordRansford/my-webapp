"use client";

import React, { useState, useMemo } from "react";
import { Settings, Save, X, Check } from "lucide-react";

interface TemplateField {
  id: string;
  label: string;
  type: "text" | "number" | "select" | "toggle" | "multiselect";
  defaultValue?: any;
  options?: string[];
  description?: string;
  required?: boolean;
}

interface TemplateCustomizerProps {
  template: {
    id: string;
    title: string;
    fields?: TemplateField[];
  };
  onSave?: (customizations: Record<string, any>) => void;
  onCancel?: () => void;
  initialValues?: Record<string, any>;
}

export function TemplateCustomizer({
  template,
  onSave,
  onCancel,
  initialValues = {}
}: TemplateCustomizerProps) {
  const [values, setValues] = useState<Record<string, any>>(initialValues);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const fields = template.fields || [];

  const handleChange = (fieldId: string, value: any) => {
    setValues(prev => ({ ...prev, [fieldId]: value }));
    // Clear error for this field
    if (errors[fieldId]) {
      setErrors(prev => {
        const next = { ...prev };
        delete next[fieldId];
        return next;
      });
    }
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    fields.forEach(field => {
      if (field.required && (values[field.id] === undefined || values[field.id] === "" || 
          (Array.isArray(values[field.id]) && values[field.id].length === 0))) {
        newErrors[field.id] = `${field.label} is required`;
      }
    });
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate() && onSave) {
      onSave(values);
    }
  };

  const renderField = (field: TemplateField) => {
    const value = values[field.id] ?? field.defaultValue;
    const error = errors[field.id];

    switch (field.type) {
      case "text":
        return (
          <div key={field.id} className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              {field.label}
              {field.required && <span className="text-rose-600 ml-1">*</span>}
            </label>
            <input
              type="text"
              value={value || ""}
              onChange={(e) => handleChange(field.id, e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${
                error ? "border-rose-300" : "border-slate-200"
              } focus:outline-none focus:ring-2 focus:ring-sky-500`}
            />
            {field.description && (
              <p className="text-xs text-slate-500">{field.description}</p>
            )}
            {error && <p className="text-xs text-rose-600">{error}</p>}
          </div>
        );

      case "number":
        return (
          <div key={field.id} className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              {field.label}
              {field.required && <span className="text-rose-600 ml-1">*</span>}
            </label>
            <input
              type="number"
              value={value || ""}
              onChange={(e) => handleChange(field.id, Number(e.target.value))}
              className={`w-full px-3 py-2 rounded-lg border ${
                error ? "border-rose-300" : "border-slate-200"
              } focus:outline-none focus:ring-2 focus:ring-sky-500`}
            />
            {field.description && (
              <p className="text-xs text-slate-500">{field.description}</p>
            )}
            {error && <p className="text-xs text-rose-600">{error}</p>}
          </div>
        );

      case "select":
        return (
          <div key={field.id} className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              {field.label}
              {field.required && <span className="text-rose-600 ml-1">*</span>}
            </label>
            <select
              value={value || ""}
              onChange={(e) => handleChange(field.id, e.target.value)}
              className={`w-full px-3 py-2 rounded-lg border ${
                error ? "border-rose-300" : "border-slate-200"
              } focus:outline-none focus:ring-2 focus:ring-sky-500`}
            >
              <option value="">Select...</option>
              {field.options?.map(opt => (
                <option key={opt} value={opt}>{opt}</option>
              ))}
            </select>
            {field.description && (
              <p className="text-xs text-slate-500">{field.description}</p>
            )}
            {error && <p className="text-xs text-rose-600">{error}</p>}
          </div>
        );

      case "toggle":
        return (
          <div key={field.id} className="flex items-center justify-between">
            <div>
              <label className="block text-sm font-medium text-slate-700">
                {field.label}
                {field.required && <span className="text-rose-600 ml-1">*</span>}
              </label>
              {field.description && (
                <p className="text-xs text-slate-500 mt-1">{field.description}</p>
              )}
            </div>
            <button
              type="button"
              onClick={() => handleChange(field.id, !value)}
              className={`relative w-12 h-6 rounded-full transition-colors ${
                value ? "bg-sky-600" : "bg-slate-300"
              }`}
            >
              <span
                className={`absolute top-1 left-1 w-4 h-4 bg-white rounded-full transition-transform ${
                  value ? "translate-x-6" : "translate-x-0"
                }`}
              />
            </button>
          </div>
        );

      case "multiselect":
        return (
          <div key={field.id} className="space-y-1">
            <label className="block text-sm font-medium text-slate-700">
              {field.label}
              {field.required && <span className="text-rose-600 ml-1">*</span>}
            </label>
            <div className="space-y-2">
              {field.options?.map(opt => {
                const isSelected = (value || []).includes(opt);
                return (
                  <label key={opt} className="flex items-center gap-2 cursor-pointer">
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={(e) => {
                        const current = value || [];
                        if (e.target.checked) {
                          handleChange(field.id, [...current, opt]);
                        } else {
                          handleChange(field.id, current.filter((v: string) => v !== opt));
                        }
                      }}
                      className="w-4 h-4 text-sky-600 rounded border-slate-300 focus:ring-sky-500"
                    />
                    <span className="text-sm text-slate-700">{opt}</span>
                  </label>
                );
              })}
            </div>
            {field.description && (
              <p className="text-xs text-slate-500">{field.description}</p>
            )}
            {error && <p className="text-xs text-rose-600">{error}</p>}
          </div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-2">
          <Settings className="w-5 h-5 text-slate-600" />
          <h2 className="text-xl font-semibold text-slate-900">Customize Template</h2>
        </div>
        {onCancel && (
          <button
            onClick={onCancel}
            className="text-slate-600 hover:text-slate-900"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      <div className="mb-4">
        <h3 className="font-semibold text-slate-900">{template.title}</h3>
        <p className="text-sm text-slate-600 mt-1">
          Configure this template before starting. All fields marked with * are required.
        </p>
      </div>

      <div className="space-y-4">
        {fields.map(field => renderField(field))}
      </div>

      {fields.length === 0 && (
        <div className="text-center py-8 text-slate-600">
          <p>This template has no customization options.</p>
          <p className="text-sm mt-2">Click &quot;Start Template&quot; to begin with default settings.</p>
        </div>
      )}

      <div className="flex gap-3 mt-6 pt-6 border-t border-slate-200">
        <button
          onClick={handleSave}
          disabled={fields.length === 0}
          className="flex-1 px-4 py-2 bg-sky-600 text-white rounded-lg font-medium hover:bg-sky-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Save className="w-4 h-4" />
          Save & Start Template
        </button>
        {onCancel && (
          <button
            onClick={onCancel}
            className="px-4 py-2 border border-slate-300 text-slate-700 rounded-lg font-medium hover:bg-slate-50 transition-colors"
          >
            Cancel
          </button>
        )}
      </div>
    </div>
  );
}
