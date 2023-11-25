
def sainte_lague(votes, num_seats):
    # Initialize seats for each party
    seats = {party: 0 for party in votes}

    # Calculate divisor for each party
    divisors = {party: 0.5 for party in votes}

    # Seat allocation process
    for _ in range(num_seats):
        quotients = {party: votes[party] / divisors[party] for party in votes}
        
        # Find the party with the highest quotient
        winning_party = max(quotients, key=quotients.get)
        
        # Increment the seat for the winning party
        seats[winning_party] += 1
        
        # Recalculate the divisor for the winning party
        divisors[winning_party] += 1

    return seats

# Example usage:
# party_votes = {'CSU': 4829472, 'FW': 2026104, 'AfD': 1562982, "Grüne": 2682852, "SPD": 1161681}
# party_votes = {'CSU': 1609824, 'FW': 675368, 'AfD': 520994, "Grüne": 894284	, "SPD": 387227	}
party_votes = {'CSU': 706704, 'FW': 328583, 'AfD': 328165, "Grüne": 245253, "SPD": 134399}

allocated_seats = sainte_lague(party_votes, num_seats=31)

print("Seat Allocation:")
for party, seats in allocated_seats.items():
    print(f"{party}: {seats} seats")
