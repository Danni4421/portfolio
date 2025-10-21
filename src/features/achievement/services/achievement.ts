import { supabase } from '@/lib/supabase';
import type { Achievement } from '../types';

export const getAchievements = async (): Promise<{ achievements: Array<Achievement> }> => {
	try {
		const response = await supabase.from('achievements').select();
		return {
			achievements: response.data || []
		};
	} catch {
		return {
			achievements: []
		};
	}
};
