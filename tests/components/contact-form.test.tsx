import { cleanup, fireEvent, render, screen, waitFor } from '@testing-library/react';
import { afterEach, describe, expect, it, vi } from 'vitest';
import { ContactForm } from '@/app/contact/ContactForm';
afterEach(() => { cleanup(); vi.unstubAllGlobals(); });
function fill(name = 'Alice', message = 'Hello') {
  fireEvent.change(screen.getByLabelText('name'), { target: { value: name } });
  fireEvent.change(screen.getByLabelText('message'), { target: { value: message } });
}
describe('contact form', () => {
  it('exposes matching input limits and rejects whitespace without a request', () => {
    const fetch = vi.fn(); vi.stubGlobal('fetch', fetch); render(<ContactForm />);
    expect((screen.getByLabelText('name') as HTMLInputElement).maxLength).toBe(100);
    expect((screen.getByLabelText('email (optional)') as HTMLInputElement).maxLength).toBe(254);
    expect((screen.getByLabelText('message') as HTMLTextAreaElement).maxLength).toBe(5000);
    fill('   ', '\n '); fireEvent.submit(screen.getByLabelText('name').closest('form')!);
    expect(screen.getByRole('alert').textContent).toContain('required'); expect(fetch).not.toHaveBeenCalled();
  });
  it('submits normalized fields and shows success', async () => {
    const fetch = vi.fn().mockResolvedValue({ ok: true, json: async () => ({ success: true }) });
    vi.stubGlobal('fetch', fetch); render(<ContactForm />); fill(' Alice ', ' Hello ');
    fireEvent.submit(screen.getByLabelText('name').closest('form')!);
    await waitFor(() => expect(screen.getByText('message sent successfully!')).toBeTruthy());
    expect(JSON.parse(fetch.mock.calls[0][1].body)).toMatchObject({ name: 'Alice', message: 'Hello' });
  });
  it('shows server errors and re-enables the form', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue({ ok: false, json: async () => ({ error: 'Too many requests' }) }));
    render(<ContactForm />); fill(); fireEvent.submit(screen.getByLabelText('name').closest('form')!);
    await waitFor(() => expect(screen.getByRole('alert').textContent).toBe('Too many requests'));
    expect((screen.getByRole('button', { name: /submit/ }) as HTMLButtonElement).disabled).toBe(false);
  });
});
