document.addEventListener('DOMContentLoaded', function () {
 // Chart.js implementation
 const beforeCtx = document.getElementById('beforeChart').getContext('2d');
 const afterCtx = document.getElementById('afterChart').getContext('2d');
 
 const beforeData = {
  labels: ['Unqualified Leads', 'Contacted but Lost', 'Enrolled'],
  datasets: [{
   label: 'Lead Outcomes',
   data: [85, 13, 2],
   backgroundColor: ['#fecaca', '#fca5a5', '#dc2626'],
   borderColor: '#f8fafc',
   borderWidth: 4,
  }]
 };
 
 const afterData = {
  labels: ['Unqualified Leads', 'Contacted but Lost', 'Enrolled'],
  datasets: [{
   label: 'Lead Outcomes',
   data: [30, 20, 50],
   backgroundColor: ['#a7f3d0', '#6ee7b7', '#10b981'],
   borderColor: '#f8fafc',
   borderWidth: 4,
  }]
 };
 
 const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
   legend: {
    position: 'bottom',
   },
   tooltip: {
    callbacks: {
     label: function(context) {
      return `${context.label}: ${context.raw}%`;
     }
    }
   }
  }
 };
 
 new Chart(beforeCtx, { type: 'doughnut', data: beforeData, options: chartOptions });
 new Chart(afterCtx, { type: 'doughnut', data: afterData, options: chartOptions });

 // Form handling
 const form = document.getElementById('proposalForm');
 const emailInput = document.getElementById('email');
 const emailError = document.getElementById('email-error');
 const formContainer = document.getElementById('form-container-main');
 const successMessage = document.getElementById('success-message');
 const organizationSelect = document.getElementById('organization');
 const sponsorRoleContainer = document.getElementById('sponsorRoleContainer');
 const siteRoleContainer = document.getElementById('siteRoleContainer');
 const sponsorRoleSelect = document.getElementById('sponsorRole');
 const siteRoleSelect = document.getElementById('siteRole');
 const countryCodeSelect = document.getElementById('country-code');

 // Country codes data
 const countryCodes = [
  { name: 'United States', code: '+1', iso: 'US' },
  { name: 'Canada', code: '+1', iso: 'CA' },
  { name: 'United Kingdom', code: '+44', iso: 'GB' },
  { name: 'Afghanistan', code: '+93', iso: 'AF' },
  { name: 'Albania', code: '+355', iso: 'AL' },
  { name: 'Algeria', code: '+213', iso: 'DZ' },
  { name: 'Andorra', code: '+376', iso: 'AD' },
  { name: 'Angola', code: '+244', iso: 'AO' },
  { name: 'Argentina', code: '+54', iso: 'AR' },
  { name: 'Armenia', code: '+374', iso: 'AM' },
  { name: 'Australia', code: '+61', iso: 'AU' },
  { name: 'Austria', code: '+43', iso: 'AT' },
  { name: 'Azerbaijan', code: '+994', iso: 'AZ' },
  { name: 'Bahamas', code: '+1-242', iso: 'BS' },
  { name: 'Bahrain', code: '+973', iso: 'BH' },
  { name: 'Bangladesh', code: '+880', iso: 'BD' },
  { name: 'Belarus', code: '+375', iso: 'BY' },
  { name: 'Belgium', code: '+32', iso: 'BE' },
  { name: 'Belize', code: '+501', iso: 'BZ' },
  { name: 'Benin', code: '+229', iso: 'BJ' },
  { name: 'Bhutan', code: '+975', iso: 'BT' },
  { name: 'Bolivia', code: '+591', iso: 'BO' },
  { name: 'Bosnia and Herzegovina', code: '+387', iso: 'BA' },
  { name: 'Botswana', code: '+267', iso: 'BW' },
  { name: 'Brazil', code: '+55', iso: 'BR' },
  { name: 'Brunei', code: '+673', iso: 'BN' },
  { name: 'Bulgaria', code: '+359', iso: 'BG' },
  { name: 'Burkina Faso', code: '+226', iso: 'BF' },
  { name: 'Cambodia', code: '+855', iso: 'KH' },
  { name: 'Cameroon', code: '+237', iso: 'CM' },
  { name: 'Cape Verde', code: '+238', iso: 'CV' },
  { name: 'Chad', code: '+235', iso: 'TD' },
  { name: 'Chile', code: '+56', iso: 'CL' },
  { name: 'China', code: '+86', iso: 'CN' },
  { name: 'Colombia', code: '+57', iso: 'CO' },
  { name: 'Congo, Dem. Rep.', code: '+243', iso: 'CD' },
  { name: 'Congo, Rep.', code: '+242', iso: 'CG' },
  { name: 'Costa Rica', code: '+506', iso: 'CR' },
  { name: 'Croatia', code: '+385', iso: 'HR' },
  { name: 'Cuba', code: '+53', iso: 'CU' },
  { name: 'Cyprus', code: '+357', iso: 'CY' },
  { name: 'Czech Republic', code: '+420', iso: 'CZ' },
  { name: 'Denmark', code: '+45', iso: 'DK' },
  { name: 'Djibouti', code: '+253', iso: 'DJ' },
  { name: 'Dominican Republic', code: '+1-809', iso: 'DO' },
  { name: 'Ecuador', code: '+593', iso: 'EC' },
  { name: 'Egypt', code: '+20', iso: 'EG' },
  { name: 'El Salvador', code: '+503', iso: 'SV' },
  { name: 'Estonia', code: '+372', iso: 'EE' },
  { name: 'Ethiopia', code: '+251', iso: 'ET' },
  { name: 'Fiji', code: '+679', iso: 'FJ' },
  { name: 'Finland', code: '+358', iso: 'FI' },
  { name: 'France', code: '+33', iso: 'FR' },
  { name: 'Gabon', code: '+241', iso: 'GA' },
  { name: 'Georgia', code: '+995', iso: 'GE' },
  { name: 'Germany', code: '+49', iso: 'DE' },
  { name: 'Ghana', code: '+233', iso: 'GH' },
  { name: 'Greece', code: '+30', iso: 'GR' },
  { name: 'Guatemala', code: '+502', iso: 'GT' },
  { name: 'Honduras', code: '+504', iso: 'HN' },
  { name: 'Hungary', code: '+36', iso: 'HU' },
  { name: 'Iceland', code: '+354', iso: 'IS' },
  { name: 'India', code: '+91', iso: 'IN' },
  { name: 'Indonesia', code: '+62', iso: 'ID' },
  { name: 'Iran', code: '+98', iso: 'IR' },
  { name: 'Iraq', code: '+964', iso: 'IQ' },
  { name: 'Ireland', code: '+353', iso: 'IE' },
  { name: 'Israel', code: '+972', iso: 'IL' },
  { name: 'Italy', code: '+39', iso: 'IT' },
  { name: 'Jamaica', code: '+1-876', iso: 'JM' },
  { name: 'Japan', code: '+81', iso: 'JP' },
  { name: 'Jordan', code: '+962', iso: 'JO' },
  { name: 'Kazakhstan', code: '+7', iso: 'KZ' },
  { name: 'Kenya', code: '+254', iso: 'KE' },
  { name: 'Kuwait', code: '+965', iso: 'KW' },
  { name: 'Laos', code: '+856', iso: 'LA' },
  { name: 'Latvia', code: '+371', iso: 'LV' },
  { name: 'Lebanon', code: '+961', iso: 'LB' },
  { name: 'Libya', code: '+218', iso: 'LY' },
  { name: 'Lithuania', code: '+370', iso: 'LT' },
  { name: 'Luxembourg', code: '+352', iso: 'LU' },
  { name: 'Malaysia', code: '+60', iso: 'MY' },
  { name: 'Maldives', code: '+960', iso: 'MV' },
  { name: 'Mali', code: '+223', iso: 'ML' },
  { name: 'Malta', code: '+356', iso: 'MT' },
  { name: 'Mexico', code: '+52', iso: 'MX' },
  { name: 'Monaco', code: '+377', iso: 'MC' },
  { name: 'Mongolia', code: '+976', iso: 'MN' },
  { name: 'Montenegro', code: '+382', iso: 'ME' },
  { name: 'Morocco', code: '+212', iso: 'MA' },
  { name: 'Mozambique', code: '+258', iso: 'MZ' },
  { name: 'Myanmar', code: '+95', iso: 'MM' },
  { name: 'Nepal', code: '+977', iso: 'NP' },
  { name: 'Netherlands', code: '+31', iso: 'NL' },
  { name: 'New Zealand', code: '+64', iso: 'NZ' },
  { name: 'Nicaragua', code: '+505', iso: 'NI' },
  { name: 'Niger', code: '+227', iso: 'NE' },
  { name: 'Nigeria', code: '+234', iso: 'NG' },
  { name: 'North Korea', code: '+850', iso: 'KP' },
  { name: 'North Macedonia', code: '+389', iso: 'MK' },
  { name: 'Norway', code: '+47', iso: 'NO' },
  { name: 'Oman', code: '+968', iso: 'OM' },
  { name: 'Pakistan', code: '+92', iso: 'PK' },
  { name: 'Panama', code: '+507', iso: 'PA' },
  { name: 'Paraguay', code: '+595', iso: 'PY' },
  { name: 'Peru', code: '+51', iso: 'PE' },
  { name: 'Philippines', code: '+63', iso: 'PH' },
  { name: 'Poland', code: '+48', iso: 'PL' },
  { name: 'Portugal', code: '+351', iso: 'PT' },
  { name: 'Qatar', code: '+974', iso: 'QA' },
  { name: 'Romania', code: '+40', iso: 'RO' },
  { name: 'Russia', code: '+7', iso: 'RU' },
  { name: 'Saudi Arabia', code: '+966', iso: 'SA' },
  { name: 'Senegal', code: '+221', iso: 'SN' },
  { name: 'Serbia', code: '+381', iso: 'RS' },
  { name: 'Singapore', code: '+65', iso: 'SG' },
  { name: 'Slovakia', code: '+421', iso: 'SK' },
  { name: 'Slovenia', code: '+386', iso: 'SI' },
  { name: 'Somalia', code: '+252', iso: 'SO' },
  { name: 'South Africa', code: '+27', iso: 'ZA' },
  { name: 'South Korea', code: '+82', iso: 'KR' },
  { name: 'Spain', code: '+34', iso: 'ES' },
  { name: 'Sri Lanka', code: '+94', iso: 'LK' },
  { name: 'Sudan', code: '+249', iso: 'SD' },
  { name: 'Sweden', code: '+46', iso: 'SE' },
  { name: 'Switzerland', code: '+41', iso: 'CH' },
  { name: 'Syria', code: '+963', iso: 'SY' },
  { name: 'Taiwan', code: '+886', iso: 'TW' },
  { name: 'Tanzania', code: '+255', iso: 'TZ' },
  { name: 'Thailand', code: '+66', iso: 'TH' },
  { name: 'Togo', code: '+228', iso: 'TG' },
  { name: 'Tunisia', code: '+216', iso: 'TN' },
  { name: 'Turkey', code: '+90', iso: 'TR' },
  { name: 'Uganda', code: '+256', iso: 'UG' },
  { name: 'Ukraine', code: '+380', iso: 'UA' },
  { name: 'United Arab Emirates', code: '+971', iso: 'AE' },
  { name: 'Uruguay', code: '+598', iso: 'UY' },
  { name: 'Uzbekistan', code: '+998', iso: 'UZ' },
  { name: 'Venezuela', code: '+58', iso: 'VE' },
  { name: 'Vietnam', code: '+84', iso: 'VN' },
  { name: 'Yemen', code: '+967', iso: 'YE' },
  { name: 'Zambia', code: '+260', iso: 'ZM' },
  { name: 'Zimbabwe', code: '+263', iso: 'ZW' }
 ];

 // Populate country codes
 countryCodes.forEach(country => {
  const option = document.createElement('option');
  option.value = country.code;
  option.textContent = `${country.iso} (${country.code})`;
  if (country.iso === 'US') { option.selected = true; }
  countryCodeSelect.appendChild(option);
 });

 // Organization change handler
 organizationSelect.addEventListener('change', function() {
  const selection = this.value;
  sponsorRoleContainer.classList.add('hidden');
  sponsorRoleSelect.required = false;
  siteRoleContainer.classList.add('hidden');
  siteRoleSelect.required = false;
  
  if (selection === 'sponsor' || selection === 'cro') {
   sponsorRoleContainer.classList.remove('hidden');
   sponsorRoleSelect.required = true;
  } else if (selection === 'site' || selection === 'smo' || selection === 'amc' || selection === 'hs') {
   siteRoleContainer.classList.remove('hidden');
   siteRoleSelect.required = true;
  }
 });

 // Email validation
 const forbiddenDomains = [
  'gmail.com', 'yahoo.com', 'hotmail.com', 'aol.com', 'outlook.com', 
  'icloud.com', 'live.com', 'msn.com', 'yandex.com', 'mail.ru'
 ];

 // Form submission
 form.addEventListener('submit', function (e) {
  e.preventDefault();
  emailError.classList.add('hidden');
  emailInput.classList.remove('border-red-500');
  
  const email = emailInput.value.trim();
  if (!email) return;
  
  const domain = email.substring(email.lastIndexOf('@') + 1);
  if (forbiddenDomains.includes(domain.toLowerCase())) {
   emailError.classList.remove('hidden');
   emailInput.classList.add('border-red-500');
   emailInput.focus();
  } else {
   console.log('Form submitted successfully with valid email:', email);
   formContainer.classList.add('hidden');
   successMessage.classList.remove('hidden');
   
   const organization = organizationSelect.value;
   const proposalPage = (organization === 'sponsor' || organization === 'cro' || organization === 'amc') ? 
    'sponsor-proposal.html' : 'site-proposal.html';
   
   console.log(`Simulating verification email would link to: ${proposalPage}`);
  }
 });
});

