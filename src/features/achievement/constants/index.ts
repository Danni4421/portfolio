import type { Achievement } from '../types';

export const achievements: Array<Achievement> = [
	{
		id: '1',
		title: 'Kalvin Phillps Angkat Trofi',
		description:
			'Kalvin Phillips Angkat Trofi Juara Liga Inggris Bersama Manchester City di Musim 2022/2023',
		dateAchieved: new Date('2023-01-01'),
		thumbnailUrl: 'https://pbs.twimg.com/media/GNmlxyxaYAAZZj4.jpg'
	},
	{
		id: '2',
		title: 'Manchester City Juara Piala FA 2022/2023',
		description:
			'Manchester City Juara Piala FA 2022/2023 Setelah Kalahkan Manchester United 2-1, Gol De Bruyne dan Rodri Antar City Raih Treble',
		dateAchieved: new Date('2023-02-01'),
		thumbnailUrl:
			'https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRo3cx2cLciJ6RmTQexYXtd7uLjMbQtq-ODLg&s'
	},
	{
		id: '3',
		title: 'Argentina Juara Piala Dunia 2022',
		description:
			'Bersama Messi Menuju Final Piala Dunia 2022 Qatar, Argentina Juara Dunia Usai Kalahkan Prancis 4-2 di Adu Penalti',
		dateAchieved: new Date('2023-03-01'),
		thumbnailUrl: 'https://cdn.antaranews.com/cache/1200x800/2022/12/20/000_334T4YP-1.jpg'
	}
];
