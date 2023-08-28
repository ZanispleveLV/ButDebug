const banSchema = require('../models/ban-schema')
const { SlashCommandBuilder, EmbedBuilder, PermissionFlagsBits } = require('discord.js');

module.exports = {
    data: new SlashCommandBuilder()
        .setName('tempban')
        .setDescription('Temporary ban a member')
        .setDefaultMemberPermissions(PermissionFlagsBits.BanMembers)
        .addUserOption(option =>
            option.setName('user')
            .setDescription('User to ban')
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('reason')
            .setDescription('Reason for the temporary ban')
            .setRequired(true)
        )
        .addStringOption(option =>
            option.setName('duration')
            .setDescription('Duration for the temporary ban')
            .setRequired(true)
            .addChoices(
                { name: '1 day', value: '24'},
                { name: '1 week', value: '168'},
                { name: '3 weeks', value: '504'},
                { name: '1 month', value: '720'},
                { name: '3 months', value: '2160'},
                { name: 'Test', value: '0.05'}
            )
        ),
        
    async execute(interaction){
        const {channel, options} = interaction;

        const user = options.getUser('user');
        const reason = options.getString('reason');
        const duration = options.getString('duration');

        try{
            const member = await interaction.guild.members.fetch(user.id);

            if(member.roles.highest.position >= interaction.member.roles.highest.position){
                const errEmbed = new EmbedBuilder()
                    .setDescription('You can not ban a member with a higher role than yours!')
                    .setColor('#FF2145');
                return interaction.reply({ embeds: [errEmbed], ephemeral: true });
            }

            const length = duration * 60;

            const expires = new Date()
            expires.setMinutes(expires.getMinutes() + length)
            console.log(expires)

            //await member.ban({ reason: reason })

            await banSchema.create({
                userId: user.id,
                guildId: interaction.guild.id,
                reason,
                staffId: interaction.member.id,
                expires
            })

            const embed = new EmbedBuilder()
                .setTitle('Temp Banned')
                .setDescription(`${user.tag} has been banned`)
                .addFields(
                    {name: 'Reason', value: reason, inline: true},
                    {name: 'Duration', value: duration, inline: true}
                )
                .setColor('#FF2145')
                .setTimestamp();
            interaction.reply({ embeds: [embed] });

        }catch(error){
            console.error(error);
            const errEmbed = new EmbedBuilder()
                .setDescription('An error occurred while temporary banning the member.')
                .setColor('#FF2145');
            interaction.reply({ embeds: [errEmbed], ephemeral: true });
        }
    }
}