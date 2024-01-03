const { ActionRowBuilder, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder } = require('discord.js');
const Sequelize = require('sequelize');

const sequelize = new Sequelize('database', 'user', 'password', {
	host: 'localhost',
	dialect: 'sqlite',
	freezetableName: true,
	logging: false,
	// SQLite only
	storage: 'babdb.sqlite',
});

const diapStash = sequelize.define('diaperstash', {
	name: {
		type: Sequelize.STRING,
		unique: true,
	},
	// ABUniverse Brands
	space: {
		type: Sequelize.INTEGER,
		allowNull: true,
		defaultValue: 0,
	},
	littlePawz: {
		type: Sequelize.INTEGER,
		allowNull: true,
		defaultValue: 0,
	},
	simple: {
		type: Sequelize.INTEGER,
		allowNull: true,
		defaultValue: 0,
	},
	sdk: {
		type: Sequelize.INTEGER,
		allowNull: true,
		defaultValue: 0,
	},
	preSchool: {
		type: Sequelize.INTEGER,
		allowNull: true,
		defaultValue: 0,
	},
	cushies: {
		type: Sequelize.INTEGER,
		allowNull: true,
		defaultValue: 0,
	},
	peekABU: {
		type: Sequelize.INTEGER,
		allowNull: true,
		defaultValue: 0,
	},
	// Tykables Brands
	overnights: {
		type: Sequelize.INTEGER,
		allowNull: true,
		defaultValue: 0,
	},
	cammies: {
		type: Sequelize.INTEGER,
		allowNull: true,
		defaultValue: 0,
	},
	galactic: {
		type: Sequelize.INTEGER,
		allowNull: true,
		defaultValue: 0,
	},
	littleBuilders: {
		type: Sequelize.INTEGER,
		allowNull: true,
		defaultValue: 0,
	},
	unicorn: {
		type: Sequelize.INTEGER,
		allowNull: true,
		defaultValue: 0,
	},
	littleRawrs: {
		type: Sequelize.INTEGER,
		allowNull: true,
		defaultValue: 0,
	},
	trestElites: {
		type: Sequelize.INTEGER,
		allowNull: true,
		defaultValue: 0,
	},

});

function valueToName(brand, quantity) {
	switch (brand) {
	case 'peekABU':
		if (quantity === 1) {
			return 'PeekABU';
		}
		else {
			return 'PeekABUs';
		}
	case 'space':
		if (quantity === 1) {
			return 'Space';
		}
		else {
			return 'Spaces';
		}
	case 'pawz':
		return 'Little Pawz';
	case 'simple':
		if (quantity === 1) {
			return 'Simple';
		}
		else {
			return 'Simples';
		}
	case 'preschool':
		if (quantity === 1) {
			return 'PreSchool';
		}
		else {
			return 'PreSchools';
		}
	case 'cushies':
		if (quantity === 1) {
			return 'Cushies';
		}
		else {
			return 'Cushies';
		}
	case 'sdk':
		return 'Super Dry Kids';
	case 'overnights':
		if (quantity === 1) {
			return 'Overnight';
		}
		else {
			return 'Overnights';
		}
	case 'cammies':
		return 'Cammies';
	case 'galactic':
		if (quantity === 1) {
			return 'Galactic';
		}
		else {
			return 'Galactics';
		}
	case 'littleBuilders':
		return 'Little Builders';
	case 'unicorn':
		if (quantity === 1) {
			return 'Unicorn';
		}
		else {
			return 'Unicorns';
		}
	case 'littleRawrs':
		return 'Little Rawrs';
	case 'trestElites':
		if (quantity === 1) {
			return 'Trest Elite';
		}
		else {
			return 'Trest Elites';
		}
	}
}

module.exports = {
	data: new SlashCommandBuilder()
		.setName('diaperstash')
		.setDescription('Tracks how many diapers the user has in their stash.')
		.addSubcommand(subcommand =>
			subcommand
				.setName('add')
				.setDescription('Adds a diaper to the stash.')
				.addStringOption(option =>
					option
						.setName('brand')
						.setDescription('The brand of diaper to add.')
						.setRequired(true)
						.addChoices(
							{ name: 'PeekABU', value: 'peekABU' },
							{ name: 'Space', value: 'space' },
							{ name: 'Little Pawz', value: 'pawz' },
							{ name: 'Simple', value: 'simple' },
							{ name: 'PreSchool', value: 'preschool' },
							{ name: 'Cushies', value: 'cushies' },
							{ name: 'Super Dry Kids', value: 'sdk' },
							{ name: 'Overnights', value: 'overnights' },
							{ name: 'Cammies', value: 'cammies' },
							{ name: 'Galactic', value: 'galactic' },
							{ name: 'Little Builders', value: 'littleBuilders' },
							{ name: 'Unicorn', value: 'unicorn' },
							{ name: 'Little Rawrs', value: 'littleRawrs' },
							{ name: 'Trest Elites', value: 'trestElites' },
						),
				)
				.addIntegerOption(option =>
					option
						.setName('quantity')
						.setDescription('The number of diapers to add.')
						.setRequired(true)
						.setMinValue(1)
						.setMaxValue(180),

				))
		.addSubcommand(subcommand =>
			subcommand
				.setName('remove')
				.setDescription('Removes a diaper from the stash.')
				.addStringOption(option =>
					option
						.setName('brand')
						.setDescription('The brand of diaper to remove.')
						.setRequired(true)
						.addChoices(
							{ name: 'PeekABU', value: 'peekABU' },
							{ name: 'Space', value: 'space' },
							{ name: 'Little Pawz', value: 'pawz' },
							{ name: 'Simple', value: 'simple' },
							{ name: 'PreSchool', value: 'preschool' },
							{ name: 'Cushies', value: 'cushies' },
							{ name: 'Super Dry Kids', value: 'sdk' },
							{ name: 'Overnights', value: 'overnights' },
							{ name: 'Cammies', value: 'cammies' },
							{ name: 'Galactic', value: 'galactic' },
							{ name: 'Little Builders', value: 'littleBuilders' },
							{ name: 'Unicorn', value: 'unicorn' },
							{ name: 'Little Rawrs', value: 'littleRawrs' },
							{ name: 'Trest Elites', value: 'trestElites' },
						),
				)
				.addIntegerOption(option =>
					option
						.setName('quantity')
						.setDescription('The number of diapers to remove.'),
				))
		.addSubcommand(subcommand =>
			subcommand
				.setName('list')
				.setDescription('Displays your current diaper stash'),
		),
	async execute(interaction) {
		if (interaction.options.getSubcommand() === 'add') {
			const brand = interaction.options.getString('brand');
			const quantity = interaction.options.getInteger('quantity');
			const user = await diapStash.findOne({ where: { name: interaction.user.username } });
			if (!user) {
				await interaction.reply({ content: 'Oops! Looks like you\'re not registered, kiddo! Use /register to get started!', ephemeral: true });
			}
			else if (quantity > 180) {
				return interaction.reply({ content: 'You can\'t add more than 180 diapers at a time.', ephemeral: true });
			}
			else if (quantity < 1) {
				return interaction.reply({ content: 'You can\'t add less than 1 diaper at a time.', ephemeral: true });
			}
			await diapStash.increment({ [brand]: quantity }, { where: { name: interaction.user.username } });
			await diapStash.sync();
			// TODO: Create a function to translate the value of the user's choice into a more user friendly string for the reply.
			await interaction.reply({ content: `You have added ${quantity} ${valueToName(brand, quantity)} to your diaper stash.`, ephemeral: true });
		}
		if (interaction.options.getSubcommand() === 'remove') {
			const brand = interaction.options.getString('brand');
			const brandName = interaction.options.getValues('brand');
			const quantity = interaction.options.getInteger('quantity');
			const user = await diapStash.findOne({ where: { name: interaction.user.username } });
			if (!user) {
				await interaction.reply({ content: 'Oops! Looks like you\'re not registered, kiddo! Use /register to get started!', ephemeral: true });
			}
			else if (quantity > 180) {
				return interaction.reply({ content: 'You can\'t remove more than 180 diapers at a time.', ephemeral: true });
			}
			else if (quantity < 1) {
				return interaction.reply({ content: 'You can\'t remove less than 1 diaper at a time.', ephemeral: true });
			}
			await diapStash.decrement({ [brand]: quantity }, { where: { name: interaction.user.username } });
			await diapStash.sync();
			await interaction.reply({ content: `You have removed ${quantity} ${brandName} diapers from your stash.`, ephemeral: true });
		}
		if (interaction.options.getSubcommand() === 'list') {
			const currentStash = await diapStash.findAll({
				where: {
					[Sequelize.and]: {
						name: interaction.user.username,
						[Sequelize.col()]: { [Sequelize.ne] : 0 },
					},
				},
			},
			);
			console.log(currentStash);
			const stashString = currentStash.map(t => `${t.name} has ${t.space} Space, ${t.littlePawz} Little Pawz, ${t.simple} Simple, ${t.sdk} Super Dry Kids, ${t.preSchool} PreSchool, ${t.cushies} Cushies, ${t.peekABU} PeekABU, ${t.overnights} Overnights, ${t.cammies} Cammies, ${t.galactic} Galactic, ${t.littleBuilders} Little Builders, ${t.unicorn} Unicorn, ${t.littleRawrs} Little Rawrs, and ${t.trestElites} Trest Elites.`).join('\n');
			await interaction.reply({ content: `${stashString}`, ephemeral: true });
		}
	},
};