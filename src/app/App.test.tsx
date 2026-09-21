import { describe, it, expect, vi } from 'vitest';
import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { App } from './App';
import { LanguageProvider } from '../i18n';

function renderApp() {
  return render(
    <LanguageProvider>
      <App />
    </LanguageProvider>,
  );
}

describe('App - end-to-end calculation flow', () => {
  it('completes a full plot valuation: search village -> select -> pick type -> enter area -> calculate', async () => {
    const user = userEvent.setup();
    renderApp();

    // Step 1: search and select a village by typing Hinglish
    const searchInput = screen.getByLabelText(/ग्राम\/मोहल्ला का नाम/);
    await user.type(searchInput, 'aharak');

    const option = await screen.findByRole('option', { name: /अहरक/ });
    await user.click(option);

    // Village badge should now show
    expect(screen.getByText(/Aharak/)).toBeInTheDocument();

    // Step 2: property type defaults to "Residential" -- enter area directly
    const areaInput = screen.getByLabelText(/^क्षेत्रफल \(वर्गमीटर में\)/) as HTMLInputElement;
    await user.clear(areaInput);
    await user.type(areaInput, '150');

    // road width defaults to 0-3m (rate 9000 for Aharak); switch to 9-18m (rate 13000)
    const roadWidthSelect = screen.getByLabelText(/मार्ग की चौड़ाई/) as HTMLSelectElement;
    await user.selectOptions(roadWidthSelect, 'res_9_18m');

    // Step 3: calculate
    const calcButton = screen.getByRole('button', { name: /मूल्यांकन करें/ });
    await user.click(calcButton);

    // 13000 * 150 = 1,950,000 (no boundary bonus)
    expect(await screen.findByText('₹19,50,000')).toBeInTheDocument();
  });

  it('shows an inline error and does not calculate when area is missing', async () => {
    const user = userEvent.setup();
    renderApp();

    const searchInput = screen.getByLabelText(/ग्राम\/मोहल्ला का नाम/);
    await user.type(searchInput, 'aharak');
    const option = await screen.findByRole('option', { name: /अहरक/ });
    await user.click(option);

    const calcButton = screen.getByRole('button', { name: /मूल्यांकन करें/ });
    await user.click(calcButton);

    expect(await screen.findByRole('alert')).toHaveTextContent('क्षेत्रफल आवश्यक है');
    expect(screen.queryByRole('status')).not.toBeInTheDocument();
  });

  it('switches to English and shows English result labels for the same calculation', async () => {
    const user = userEvent.setup();
    renderApp();

    await user.click(screen.getByRole('button', { name: 'English' }));

    const searchInput = screen.getByLabelText(/Enter Village\/Mohalla name/);
    await user.type(searchInput, 'aharak');
    const option = await screen.findByRole('option', { name: /Aharak/ });
    await user.click(option);

    const areaInput = screen.getByLabelText(/^Area \(in sq\. meters\)/) as HTMLInputElement;
    await user.type(areaInput, '100');

    await user.click(screen.getByRole('button', { name: /Calculate Valuation/ }));

    const result = await screen.findByRole('status');
    expect(within(result).getByText('Total Valuation = ₹9,00,000')).toBeInTheDocument();
    expect(within(result).getByText(/Nine Lakh Rupees Only/)).toBeInTheDocument();
  });

  it('reset clears the village selection and calculated result', async () => {
    const user = userEvent.setup();
    renderApp();

    const searchInput = screen.getByLabelText(/ग्राम\/मोहल्ला का नाम/);
    await user.type(searchInput, 'aharak');
    const option = await screen.findByRole('option', { name: /अहरक/ });
    await user.click(option);

    const areaInput = screen.getByLabelText(/^क्षेत्रफल \(वर्गमीटर में\)/);
    await user.type(areaInput, '100');
    await user.click(screen.getByRole('button', { name: /मूल्यांकन करें/ }));
    expect(await screen.findByRole('status')).toBeInTheDocument();

    // confirm() is not available in jsdom by default; stub it to accept.
    vi.spyOn(window, 'confirm').mockReturnValue(true);
    await user.click(screen.getByRole('button', { name: /नया मूल्यांकन शुरू करें/ }));

    expect(screen.queryByRole('status')).not.toBeInTheDocument();
    expect(screen.queryByText(/Aharak/)).not.toBeInTheDocument();
  });
});
