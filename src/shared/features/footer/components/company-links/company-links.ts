import './company-links.scss';

const COMPANY_ITEMS = [
  { id: 'about-us', label: 'About Us' },
  { id: 'contact', label: 'Contact' },
  { id: 'privacy-policy', label: 'Privacy Policy' },
  { id: 'terms-of-service', label: 'Terms of Service' },
];

export function createCompanyLinks(): HTMLElement {
  const companyLinks = document.createElement('nav');
  companyLinks.classList.add('company-links');

  const heading = document.createElement('h3');
  heading.textContent = 'Company';
  companyLinks.append(heading);

  for (const { id, label } of COMPANY_ITEMS) {
    const link = document.createElement('a');
    link.href = `#${id}`;
    link.textContent = label;
    companyLinks.append(link);
  }

  return companyLinks;
}
