import React from "react";
import {
  Field,
  FieldDescription,
  FieldError,
  FieldGroup,
  FieldLabel,
  FieldLegend,
  FieldSet,
} from "@/components/ui/field";
import { Input as ShadcnInput } from "@/components/ui/input";
import { Textarea as ShadcnTextarea } from "@/components/ui/textarea";
import { Checkbox } from "@/components/ui/checkbox";
import {
  Select as ShadcnSelect,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Control, Controller, FieldValues, Path } from "react-hook-form";
import { 
  Upload, 
  X, 
  Loader2, 
  Image as ImageIcon,
  Eye,
  EyeOff
} from "lucide-react";
import { cn } from "@/lib/utils";
import { useState } from "react";


// ── 1. Form.Input ──────────────────────────────────────────────────

interface FormInputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  type?: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
}

function Input<T extends FieldValues>({
  control,
  name,
  label,
  type = "text",
  placeholder,
  description,
  disabled = false,
}: FormInputProps<T>) {
  const fieldId = String(name).replace(/\./g, "-");

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={fieldId} className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1.5">{label}</FieldLabel>
          <ShadcnInput
            id={fieldId}
            type={type}
            placeholder={placeholder}
            disabled={disabled}
            aria-invalid={fieldState.invalid}
            className="h-12 border-gray-200 bg-gray-50/50 focus:bg-white transition-colors"
            {...field}
            value={field.value || ""}
          />
          {description && <FieldDescription className="text-[9px] uppercase tracking-wider text-gray-400 mt-1.5">{description}</FieldDescription>}
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}

// ── 1.1 Form.Password ────────────────────────────────────────────────

function Password<T extends FieldValues>({
  control,
  name,
  label,
  placeholder = "••••••••",
  description,
  disabled = false,
}: Omit<FormInputProps<T>, 'type'>) {
  const [showPassword, setShowPassword] = useState(false);
  const fieldId = String(name).replace(/\./g, "-");

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={fieldId} className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1.5">{label}</FieldLabel>
          <div className="relative">
            <ShadcnInput
              id={fieldId}
              type={showPassword ? "text" : "password"}
              placeholder={placeholder}
              disabled={disabled}
              aria-invalid={fieldState.invalid}
              className="h-12 border-gray-200 bg-gray-50/50 focus:bg-white transition-colors pr-12"
              {...field}
              value={field.value || ""}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              disabled={disabled}
              className="absolute right-0 top-0 h-full px-4 text-gray-400 hover:text-black transition-colors"
            >
              {showPassword ? <EyeOff className="size-4" /> : <Eye className="size-4" />}
            </button>
          </div>
          {description && <FieldDescription className="text-[9px] uppercase tracking-wider text-gray-400 mt-1.5">{description}</FieldDescription>}
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}

// ── 2. Form.Textarea ───────────────────────────────────────────────

interface FormTextareaProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  placeholder?: string;
  description?: string;
  disabled?: boolean;
  rows?: number;
}

function Textarea<T extends FieldValues>({
  control,
  name,
  label,
  placeholder,
  description,
  disabled = false,
  rows = 4,
}: FormTextareaProps<T>) {
  const fieldId = String(name).replace(/\./g, "-");

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={fieldId} className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1.5">{label}</FieldLabel>
          <ShadcnTextarea
            id={fieldId}
            placeholder={placeholder}
            disabled={disabled}
            rows={rows}
            className="resize-none border-gray-200 bg-gray-50/50 focus:bg-white transition-colors"
            aria-invalid={fieldState.invalid}
            {...field}
            value={field.value || ""}
          />
          {description && <FieldDescription className="text-[9px] uppercase tracking-wider text-gray-400 mt-1.5">{description}</FieldDescription>}
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}

// ── 3. Form.Select ─────────────────────────────────────────────────

export interface SelectOption {
  label: string;
  value: string;
}

interface FormSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: SelectOption[];
  placeholder?: string;
  description?: string;
  disabled?: boolean;
}

function Select<T extends FieldValues>({
  control,
  name,
  label,
  options,
  placeholder = "Select an option",
  description,
  disabled = false,
}: FormSelectProps<T>) {
  const fieldId = String(name).replace(/\./g, "-");

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel htmlFor={fieldId} className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1.5">{label}</FieldLabel>
          <ShadcnSelect
            disabled={disabled}
            onValueChange={field.onChange}
            defaultValue={field.value}
            value={field.value ?? ""}
          >
            <SelectTrigger id={fieldId} aria-invalid={fieldState.invalid} className="h-12 border-gray-200 bg-gray-50/50 focus:bg-white transition-colors">
              <SelectValue placeholder={placeholder} />
            </SelectTrigger>
            <SelectContent>
              {options.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </ShadcnSelect>
          {description && <FieldDescription className="text-[9px] uppercase tracking-wider text-gray-400 mt-1.5">{description}</FieldDescription>}
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}

// ── 4. Form.MultiSelect ────────────────────────────────────────────

export interface MultiSelectOption {
  label: string;
  value: string;
}

interface FormMultiSelectProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  options: MultiSelectOption[];
  description?: string;
  disabled?: boolean;
}

function MultiSelect<T extends FieldValues>({
  control,
  name,
  label,
  options,
  description,
  disabled = false,
}: FormMultiSelectProps<T>) {
  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => {
        const selectedValues: string[] = Array.isArray(field.value)
          ? (field.value as string[])
          : [];

        return (
          <FieldSet data-invalid={fieldState.invalid}>
            <FieldLegend variant="label" className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1.5">{label}</FieldLegend>
            {description && <FieldDescription className="text-[9px] uppercase tracking-wider text-gray-400 mb-4">{description}</FieldDescription>}
            <FieldGroup data-slot="checkbox-group" className="grid grid-cols-2 gap-2">
              {options.map((item) => {
                const inputId = `${String(name).replace(/\./g, "-")}-${item.value}`;
                const isChecked = selectedValues.includes(item.value);

                return (
                  <Field
                    key={item.value}
                    orientation="horizontal"
                    data-invalid={fieldState.invalid}
                    className="justify-start gap-3"
                  >
                    <Checkbox
                      id={inputId}
                      checked={isChecked}
                      disabled={disabled}
                      aria-invalid={fieldState.invalid}
                      onCheckedChange={(checked) => {
                        const nextValues = checked === true
                          ? [...selectedValues, item.value]
                          : selectedValues.filter((value: string) => value !== item.value);

                        field.onChange(nextValues);
                      }}
                    />
                    <FieldLabel htmlFor={inputId} className="cursor-pointer font-normal text-sm">
                      {item.label}
                    </FieldLabel>
                  </Field>
                );
              })}
            </FieldGroup>
            <FieldError errors={[fieldState.error]} />
          </FieldSet>
        );
      }}
    />
  );
}

// ── 5. Form.ImageUpload ──────────────────────────────────────────────

interface FormImageUploadProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label: string;
  description?: string;
  disabled?: boolean;
  /**
   * Async callback that receives the raw File object.
   * Must return the uploaded file's URL string.
   * If not provided, falls back to a local blob preview (dev only).
   */
  onUpload?: (file: File) => Promise<string>;
}

function ImageUpload<T extends FieldValues>({
  control,
  name,
  label,
  description,
  disabled = false,
  onUpload,
}: FormImageUploadProps<T>) {
  const [isUploading, setIsUploading] = useState(false);

  const handleUpload = async (file: File, onChange: (value: string) => void) => {
    setIsUploading(true);
    try {
      let url: string;

      if (onUpload) {
        // Production: delegate to parent-provided upload function
        url = await onUpload(file);
      } else {
        // Fallback: local blob preview (for dev/testing only)
        url = URL.createObjectURL(file);
      }

      onChange(url);
    } catch (error) {
      console.error("[Form.ImageUpload] Upload failed:", error);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <Controller
      control={control}
      name={name}
      render={({ field, fieldState }) => (
        <Field data-invalid={fieldState.invalid}>
          <FieldLabel className="text-[10px] uppercase tracking-widest text-gray-400 font-bold mb-1.5">
            {label}
          </FieldLabel>
          
          <div className="flex items-center gap-8">
            <div className="relative size-24 border border-black overflow-hidden bg-gray-50 flex items-center justify-center group">
              {field.value ? (
                <>
                  <img src={field.value} alt="Preview" className="size-full object-cover" />
                  {!disabled && (
                    <button
                      type="button"
                      onClick={() => field.onChange("")}
                      className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                    >
                      <X className="size-5 text-white" />
                    </button>
                  )}
                </>
              ) : (
                <ImageIcon className="size-6 text-gray-200" />
              )}
              
              {isUploading && (
                <div className="absolute inset-0 bg-white/80 flex items-center justify-center">
                  <Loader2 className="size-5 animate-spin text-black" />
                </div>
              )}
            </div>

            <div className="flex-1 space-y-4">
              <div className="relative">
                <input
                  type="file"
                  accept="image/*"
                  disabled={disabled || isUploading}
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handleUpload(file, field.onChange);
                  }}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer disabled:cursor-not-allowed"
                />
                <div className={cn(
                  "flex items-center justify-center gap-3 text-[10px] uppercase tracking-[0.2em] font-bold px-6 h-12 border border-black transition-all",
                  isUploading ? "opacity-50" : "hover:bg-black hover:text-white"
                )}>
                  <Upload className="size-3" />
                  {field.value ? "Change Image" : "Upload Image"}
                </div>
              </div>
              {description && (
                <p className="text-[9px] text-gray-400 uppercase tracking-widest leading-relaxed">
                  {description}
                </p>
              )}
            </div>
          </div>
          
          <FieldError errors={[fieldState.error]} />
        </Field>
      )}
    />
  );
}

// ── Compound Export ────────────────────────────────────────────────

export const Form = {
  Input,
  Password,
  Textarea,
  Select,
  MultiSelect,
  ImageUpload,
};
