import { supabase } from '@/lib/supabase';
import type { TechStack } from '../types';

export async function getTechStacks(): Promise<{ stacks: Array<TechStack> }> {
	const { data } = await supabase.from('tech-stacks').select();
	return {
		stacks: data ?? []
	};
}
