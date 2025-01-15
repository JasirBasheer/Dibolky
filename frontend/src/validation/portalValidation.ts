export const validateField = (name: string, value: string): string => {
    if (name === 'firstName' || name === 'lastName') {
        if (!value.trim()) return 'This field is required';
        return '';
    } else if (name === 'email') {
        if (!value) return 'Email is required';
        if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) return 'Invalid email format';
        return '';
    } else if (name === 'password') {
        if (!value) return 'Password is required';
        if (value.length < 8) return 'Password must be at least 8 characters';
        return '';
    } else if (name === 'phone') {
        if (!value) return 'Phone number is required';
        if (!/^\d{10}$/.test(value)) return 'Must be exactly 10 digits';
        return '';
    } else if (name === 'organizationName') {
        if (!value.trim()) return 'Organization name is required';
        return '';
    } else if (name === 'website') {
        // if (!value.trim()) return 'Invalid website URL';
        return '';
    } else if (name === 'city' || name === 'country') {
        if (!value.trim()) return 'This field is required';
        return '';
    } else {
        return '';
    }
};
