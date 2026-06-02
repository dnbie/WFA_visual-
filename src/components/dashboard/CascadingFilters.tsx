import type { RoleSummary } from "../../types";

interface CascadingFiltersProps {
  rows: RoleSummary[];
  department: string;
  subDepartment: string;
  role: string;
  level: string;
  onDepartment: (v: string) => void;
  onSubDepartment: (v: string) => void;
  onRole: (v: string) => void;
  onLevel: (v: string) => void;
  actions: React.ReactNode;
}

function uniqueSorted(values: string[]): string[] {
  return [...new Set(values.filter(Boolean))].sort();
}

function SelectFilter({
  label,
  value,
  options,
  onChange,
  allLabel
}: {
  label: string;
  value: string;
  options: string[];
  allLabel: string;
  onChange: (value: string) => void;
}) {
  return (
    <div className="flex shrink-0 items-center gap-1">
      <label className="text-[11px] font-semibold uppercase tracking-wide text-[--wfa-text-muted]">{label}</label>
      <select
        className="max-w-[180px] rounded-md border border-[--wfa-border] bg-white px-2 py-1 text-xs"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      >
        <option value="All">{allLabel}</option>
        {options.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  );
}

export function CascadingFilters(props: CascadingFiltersProps) {
  const byDept = props.rows.filter((r) => props.department === "All" || r.department === props.department);
  const bySubDept = byDept.filter((r) => props.subDepartment === "All" || r.subDepartment === props.subDepartment);
  const byRole = bySubDept.filter((r) => props.role === "All" || r.role === props.role);

  const departments = uniqueSorted(props.rows.map((r) => r.department));
  const subDepartments = uniqueSorted(byDept.map((r) => r.subDepartment));
  const roles = uniqueSorted(bySubDept.map((r) => r.role));
  const levels = uniqueSorted(byRole.map((r) => r.level));

  return (
    <div className="mb-4 flex flex-nowrap items-center gap-2 overflow-auto rounded-xl border border-[--wfa-border] bg-white p-2">
      <SelectFilter
        label="Department"
        value={props.department}
        options={departments}
        allLabel="All departments"
        onChange={props.onDepartment}
      />
      <SelectFilter
        label="Sub-Department"
        value={props.subDepartment}
        options={subDepartments}
        allLabel="All sub-departments"
        onChange={props.onSubDepartment}
      />
      <SelectFilter label="Role" value={props.role} options={roles} allLabel="All roles" onChange={props.onRole} />
      <SelectFilter label="Level" value={props.level} options={levels} allLabel="All levels" onChange={props.onLevel} />
      <div className="ml-auto">{props.actions}</div>
    </div>
  );
}
