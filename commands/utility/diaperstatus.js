const { ActionRowBuilder, AttachmentBuilder, ButtonBuilder, ButtonStyle, StringSelectMenuBuilder, StringSelectMenuOptionBuilder, SlashCommandBuilder, ComponentType, EmbedBuilder, SlashCommandUserOption } = require('discord.js');
const changeUser = require('../../functions/changeUser.js');
const stringLibrary = require('../../config/stringLibrary.json');
const characterLogic = require('../../config/characterLogic.json');
const database = require('../../database.js');
const { characterMessage } = require('../../functions/characterMessage.js');
const wait = require('node:timers/promises').setTimeout;

// TODO: Allow users to run this command on another user. If the user is not specified, the bot will assume the user is running the command on themselves.
// If run on themselves, the bot will check the user's diaper status and prompt them to change if necessary.
module.exports = {
	data: new SlashCommandBuilder()
		.setName('diapercheck')
		.setDescription('Checks and updates the diaper status of the user.')
		.addUserOption(option =>
			option
				.setName('user')
				.setDescription('The user to check the diaper status of.')
				.setRequired(false),
		),
	async execute(interaction) {
		const user = interaction.options.getUser('user') ?? interaction.user;
		const wetMenu = new StringSelectMenuBuilder()
			.setCustomId('wetMenu')
			.setPlaceholder('How wet is your diaper?')
			.addOptions(
				new StringSelectMenuOptionBuilder()
					.setLabel('Dry')
					.setDescription('I\'m still dry!')
					.setValue('dry'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Damp')
					.setDescription('I\'m a little damp...')
					.setValue('damp'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Wet')
					.setDescription('I\'m wet!')
					.setValue('wet'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Soaked')
					.setDescription('I\'m soaked!')
					.setValue('soaked'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Leaking')
					.setDescription('Oh no!  I\'m leaking!')
					.setValue('leaking'),
			);
		const messyMenu = new StringSelectMenuBuilder()
			.setCustomId('messyMenu')
			.setPlaceholder('And how messy is your diaper?~')
			.addOptions(
				new StringSelectMenuOptionBuilder()
					.setLabel('Clean')
					.setDescription('I\'m still clean!')
					.setValue('clean'),
				new StringSelectMenuOptionBuilder()
					.setLabel('A little messy')
					.setDescription('I had a tiny accident!')
					.setValue('littleMessy'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Kinda messy')
					.setDescription('I had an accident but it\'s not too bad!')
					.setValue('messy'),
				new StringSelectMenuOptionBuilder()
					.setLabel('Very messy')
					.setDescription('My diaper is very full!')
					.setValue('veryMessy'),
			);
		const confirmButton = new ButtonBuilder()
			.setCustomId('confirmButton')
			.setLabel('Yes, I need a change!')
			.setStyle(ButtonStyle.Success);
		const cancelButton = new ButtonBuilder()
			.setCustomId('cancelButton')
			.setLabel('No, I\'m fine!')
			.setStyle(ButtonStyle.Danger);

		let attachmentImage = await characterMessage(stringLibrary.Characters.Ralsei.Change.status.self.wet.check.text, stringLibrary.Characters.Ralsei.Change.status.self.wet.check.image);
		let attachment = new AttachmentBuilder(attachmentImage, { name: 'diaperStatus.png' });

		// TODO: Depending on the selections the user made, the bot will send a message urging for the user to change their diaper.
		// We may be able to establish a "weight" that will determine how urgent the bot will be in asking the user to change their diaper.

		const row1 = new ActionRowBuilder()
			.addComponents(
				wetMenu,
			);
		const row2 = new ActionRowBuilder()
			.addComponents(
				messyMenu,
			);
		const row3 = new ActionRowBuilder()
			.addComponents(
				confirmButton,
				cancelButton,
			);
		if (user.id === interaction.user.id) {

			// TODO: Let's add a separate response block here before diving into the status check. If the user is initiating a check on themselves, the response should be different than one that occurs on a schedule.
			const response = await interaction.reply({
				files: [attachment],
				components: [row1],
				ephemeral: true });

			const wetFilter = i => {
				return i.customId === 'wetMenu' && i.user.id === interaction.user.id;
			};
			const messyFilter = i => {
				return i.customId === 'messyMenu' && i.user.id === interaction.user.id;
			};
			const changeFilter = i => {
				return (i.customId === 'confirmButton' || i.customId === 'cancelButton') && i.user.id === interaction.user.id;
			};
			// TODO: Add consideration for the user to add a booster
			// If user has a booster, wetness will be reduced by 2 levels

			let wetPriority = 0;
			let messyPriority = 0;
			let shouldChange = false;

			const wetCollector = await response.awaitMessageComponent({ filter: wetFilter, time: 60000 });
			attachmentImage = await characterMessage(stringLibrary.Characters.Ralsei.Change.status.self.wet[wetCollector.values[0]].text, stringLibrary.Characters.Ralsei.Change.status.self.wet[wetCollector.values[0]].image);
			attachment = new AttachmentBuilder(attachmentImage, { name: 'diaperStatus.png' });
			wetPriority = characterLogic.Characters.Ralsei.changeLogic.diaperStatus[wetCollector.values[0]].changePriority;
			await wetCollector.update({ files:[attachment], components: [row2] });

			const messyCollector = await response.awaitMessageComponent({ filter: messyFilter, time: 60000 });
			messyPriority = characterLogic.Characters.Ralsei.changeLogic.diaperStatus[messyCollector.values[0]].changePriority;
			attachmentImage = await characterMessage(stringLibrary.Characters.Ralsei.Change.status.self.messy[messyCollector.values[0]].text, stringLibrary.Characters.Ralsei.Change.status.self.messy[messyCollector.values[0]].image);
			attachment = new AttachmentBuilder(attachmentImage, { name: 'diaperStatus.png' });
			await messyCollector.update({ files:[attachment], components: [] });
			await wait (3_000);
			if (wetPriority + messyPriority == 0) {
				attachmentImage = await characterMessage(stringLibrary.Characters.Ralsei.Change.priority.nochange.text, stringLibrary.Characters.Ralsei.Change.priority.nochange.image);
				attachment = new AttachmentBuilder(attachmentImage, { name: 'changePriority.png' });
				shouldChange = false;
			}
			else if (wetPriority + messyPriority > 0 && wetPriority + messyPriority <= 3) {
				attachmentImage = await characterMessage(stringLibrary.Characters.Ralsei.Change.priority.lowpriority.text, stringLibrary.Characters.Ralsei.Change.priority.lowpriority.image);
				attachment = new AttachmentBuilder(attachmentImage, { name: 'changePriority.png' });
				shouldChange = false;
			}
			else if (wetPriority + messyPriority >= 4 && wetPriority + messyPriority <= 7) {
				attachmentImage = await characterMessage(stringLibrary.Characters.Ralsei.Change.priority.mediumpriority.text, stringLibrary.Characters.Ralsei.Change.priority.mediumpriority.image);
				attachment = new AttachmentBuilder(attachmentImage, { name: 'changePriority.png' });
				shouldChange = true;
			}
			else if (wetPriority + messyPriority >= 8) {
				attachmentImage = await characterMessage(stringLibrary.Characters.Ralsei.Change.priority.highpriority.text, stringLibrary.Characters.Ralsei.Change.priority.highpriority.image);
				attachment = new AttachmentBuilder(attachmentImage, { name: 'changePriority.png' });
				shouldChange = true;
			}
			if (shouldChange == false) {
				await response.edit({
					files: [attachment],
					ephemeral: true });
			}
			if (shouldChange == true) {
				await response.edit({
					files: [attachment],
					components: [row3],
					ephemeral: true });
				const changeCollector = await response.awaitMessageComponent({ filter: changeFilter, time: 60000 });
				if (changeCollector.customId === 'confirmButton') {
					attachmentImage = await characterMessage(stringLibrary.Characters.Ralsei.Change.General.changeConfirm, stringLibrary.Characters.Ralsei.Change.General.changeStart.image);
					attachment = new AttachmentBuilder(attachmentImage, { name: 'changePriority.png' });
					await response.edit({
						files: [attachment],
						ephemeral: true });
					// Do Change here
					changeUser(wetCollector.values[0], messyCollector.values[0]);
				}
			}
		}
		else {
			const userStatus = await database.diapStatus.findOne({ where: { name: user.username } });
			console.log(user);
		}
	},
};