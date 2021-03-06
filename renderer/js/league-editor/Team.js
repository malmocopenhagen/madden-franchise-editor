const FranchiseRecord = require('./abstract/FranchiseRecord');

class Team extends FranchiseRecord {
    constructor(record) {
        super(record);
        this._city = record.LongName;
        this._abbreviation = record.LongName === record.DisplayName ? '' : record.DisplayName;
        this._teamIndex = record.TeamIndex;
        this._players = [];
        this._coach = null;
        this._primaryColor = {
            'r': record.TEAM_BACKGROUNDCOLORR,
            'g': record.TEAM_BACKGROUNDCOLORG,
            'b': record.TEAM_BACKGROUNDCOLORB
        };
        this.searchTextAttributes = ['city', 'abbreviation'];
        this.mainLineAttributes = ['city', 'abbreviation'];
        this.type = 'Team';
        this._iconPath = `img/team-logos/nfl/${this.abbreviation}.png`;
    };

    get city () {
        return this._city;
    };

    set city (name) {
        this._city = name;
    };

    get abbreviation () {
        return this._abbreviation;
    };

    set abbreviation (name) {
        this._abbreviation = name;
    };

    get teamIndex () {
        return this._teamIndex;
    };

    set teamIndex (index) {
        this._teamIndex = index;
    };

    get players () {
        return this._players;
    };

    get coach () {
        return this._coach;
    };

    set coach (coach) {
        this._coach = coach;
    };

    get primaryColor() {
        return this._primaryColor;
    };

    addPlayer (player) {
        this._players.push(player);
    };
};

module.exports = Team;