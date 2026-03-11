import { supabase } from '../../lib/supabase';

export default async function handler(req, res) {
    if (req.method !== 'POST') return res.status(405).json({ message: 'Denied' });
    const { action, username, password, role, created_by, expiry_days, logo_url, favicon_url, new_days, promo_msg, hwid } = req.body;

    try {
        if (action === 'get_settings') {
            const { data } = await supabase.from('app_settings').select('*').single();
            return res.json(data || {});
        }
        if (action === 'update_settings') {
            await supabase.from('app_settings').update({ logo_url, favicon_url, promo_msg }).eq('id', 1);
            return res.json({ success: true });
        }
        if (action === 'verify') {
            const { data: user } = await supabase.from('users').select('*').eq('username', username).eq('password', password).single();
            const { data: s } = await supabase.from('app_settings').select('promo_msg').single();
            if (user && new Date(user.expiry_date) > new Date()) {
                if (!user.hwid) {
                    await supabase.from('users').update({ hwid: hwid }).eq('username', username);
                    return res.json({ success: true, seller: user.created_by, promo: "Device Bound Successfully" });
                } else if (user.hwid !== hwid) {
                    return res.status(403).json({ success: false, message: "HWID MISMATCH" });
                }
                return res.json({ success: true, seller: user.created_by, promo: s?.promo_msg });
            }
            return res.status(401).json({ success: false });
        }
        if (action === 'login') {
            const { data } = await supabase.from('users').select('*').eq('username', username).eq('password', password).neq('role', 'user').single();
            return data ? res.json({ success: true, role: data.role, user: data.username }) : res.status(401).json({ success: false });
        }
        if (action === 'add') {
            const exp = new Date(); exp.setDate(exp.getDate() + parseInt(expiry_days || 30));
            const { error } = await supabase.from('users').insert([{ username, password, role, created_by, expiry_date: exp }]);
            return error ? res.status(400).json(error) : res.json({ success: true });
        }
        if (action === 'list') {
            const { data } = await supabase.from('users').select('*').eq('created_by', username).order('created_at', { ascending: false });
            return res.json(data || []);
        }
        if (action === 'change_expiry') {
            const newExp = new Date(); newExp.setDate(newExp.getDate() + parseInt(new_days));
            await supabase.from('users').update({ expiry_date: newExp }).eq('username', username);
            return res.json({ success: true });
        }
        if (action === 'reset_hwid') {
            await supabase.from('users').update({ hwid: null }).eq('username', username);
            return res.json({ success: true });
        }
        if (action === 'delete') {
            await supabase.from('users').delete().eq('username', username);
            return res.json({ success: true });
        }
    } catch (e) { return res.status(500).json({ error: e.message }); }
                      }
