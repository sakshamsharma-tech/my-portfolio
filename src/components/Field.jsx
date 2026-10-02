/**
 * Field — reusable labelled input (DUMB component).
 *
 * Ye generic hai isliye Contact form me naam, email aur message — teeno
 * isi se bante hain (DRY). Har field type alag hai par wrapper markup,
 * label, error aur hint ek jaisa hai.
 *
 * A11y decisions (AC-03.5, NFR-04):
 *  - `<label htmlFor>` → click karne se focus input pe jaata hai
 *  - error `role="alert"` → screen reader turant bolta hai
 *  - `aria-invalid` → assistive tech ko pata hai field galat hai
 *  - `aria-describedby` → error/hint ko input se jodta hai
 */
export default function Field({
  id,
  label,
  type = 'text',
  value,
  onChange,
  error,
  hint,
  required = false,
  maxLength,
  rows,
  ...rest
}) {
  const hintId = hint ? `${id}-hint` : undefined;
  const errorId = error ? `${id}-error` : undefined;

  // aria-describedby dono ids le sakta hai, space se separated
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined;

  const isTextarea = type === 'textarea';

  return (
    <div className={`field${error ? ' field--error' : ''}`}>
      <label className="field__label" htmlFor={id}>
        {label}
        {required && (
          <span className="field__req" aria-hidden="true">
            *
          </span>
        )}
      </label>

      {hint && (
        <p className="field__hint" id={hintId}>
          {hint}
        </p>
      )}

      {isTextarea ? (
        <textarea
          id={id}
          name={id}
          className="field__input field__input--textarea"
          value={value}
          onChange={onChange}
          rows={rows ?? 5}
          required={required}
          maxLength={maxLength}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          {...rest}
        />
      ) : (
        <input
          id={id}
          name={id}
          type={type}
          className="field__input"
          value={value}
          onChange={onChange}
          required={required}
          maxLength={maxLength}
          autoComplete={rest.autoComplete}
          aria-invalid={error ? 'true' : undefined}
          aria-describedby={describedBy}
          {...rest}
        />
      )}

      {/* role="alert": change ho to screen reader turant bol de */}
      {error && (
        <p className="field__error" id={errorId} role="alert">
          {error}
        </p>
      )}
    </div>
  );
}